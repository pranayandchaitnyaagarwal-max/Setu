// Aadhaar / UIDAI e-KYC provider abstraction.
//
// Steps this implements (per the canonical ASA/KUA flow):
//   2. initiateOtp()  -> call the licensed provider; UIDAI pushes the OTP to
//                         the mobile linked with the Aadhaar (SMS).
//   5. verifyOtp()    -> send OTP back; provider returns the e-KYC payload
//                         (name, dob, gender, photo).
//
// Provider is selected by AADHAAR_PROVIDER (default 'mock').
//
//   - 'mock' : free, self-contained demo. Generates the OTP server-side and
//              delivers it by EMAIL (via the configured Gmail SMTP) so testing
//              is free. In production a real provider would SMS it instead.
//   - 'setu' : real Setu (by Truly) sandbox. Activate with AADHAAR_PROVIDER=setu
//              and SETU_API_KEY. Uses UIDAI test Aadhaar numbers. This is a
//              scaffold — confirm exact endpoints/auth against Setu docs.

import { randomBytes } from 'crypto'
import { sendEmail, emailConfigured } from './otpSender'
import { ekycFor } from './mockAadhaar'

const PROVIDER = (process.env.AADHAAR_PROVIDER || 'mock').toLowerCase()

// Per-process store for the mock OTP. On serverless this resets between
// invocations, so the route also mirrors the txnId in a signed cookie.
const mockStore = new Map()

function rid() {
  return randomBytes(12).toString('hex')
}

export async function initiateOtp({ aadhaar, email }) {
  if (PROVIDER === 'setu') return setuInitiate({ aadhaar })
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  const txnId = 'txn_' + rid()
  mockStore.set(txnId, { aadhaar, otp, exp: Date.now() + 5 * 60 * 1000 })
  let delivery = 'none'
  let sentTo = null
  if (email && emailConfigured()) {
    await sendEmail({
      to: email,
      subject: 'SETU — Aadhaar OTP Verification',
      text:
        `Your SETU Aadhaar verification OTP is ${otp}. It is valid for 5 minutes. ` +
        `Do not share it with anyone.\n\n` +
        `(In production, UIDAI delivers this OTP by SMS to the mobile number linked ` +
        `with your Aadhaar. This demo emails it to you for free testing.)`,
    })
    delivery = 'email'
    sentTo = email
  }
  return { txnId, delivery, sentTo }
}

export async function verifyOtp({ aadhaar, otp, txnId }) {
  if (PROVIDER === 'setu') return setuVerify({ aadhaar, otp, txnId })
  const rec = mockStore.get(txnId)
  if (!rec || rec.aadhaar !== aadhaar || rec.exp < Date.now()) {
    return { success: false, reason: 'expired' }
  }
  if (rec.otp !== String(otp)) return { success: false, reason: 'mismatch' }
  mockStore.delete(txnId)
  return { success: true, ekyc: ekycFor(aadhaar) }
}

// ---------------------------------------------------------------- Setu (real)
async function setuInitiate({ aadhaar }) {
  const base = process.env.SETU_BASE_URL || 'https://api.setu.co'
  const res = await fetch(`${base}/api/v2/setu/aadhaar/otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-setu-api-key': process.env.SETU_API_KEY || '',
    },
    body: JSON.stringify({ aadhaar }),
  })
  if (!res.ok) throw new Error('Setu initiate failed: ' + (await res.text()))
  const data = await res.json()
  return { txnId: data.txnId || data.transactionId, delivery: 'sms', sentTo: null }
}

async function setuVerify({ aadhaar, otp, txnId }) {
  const base = process.env.SETU_BASE_URL || 'https://api.setu.co'
  const res = await fetch(`${base}/api/v2/setu/aadhaar/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-setu-api-key': process.env.SETU_API_KEY || '',
    },
    body: JSON.stringify({ aadhaar, otp, txnId }),
  })
  if (!res.ok) throw new Error('Setu verify failed: ' + (await res.text()))
  const data = await res.json()
  const kyc = data.kyc || data.eKyc || data
  return {
    success: true,
    ekyc: {
      name: kyc.name || kyc.fullName,
      dob: kyc.dob || kyc.dateOfBirth,
      gender: kyc.gender,
      photo: kyc.photo || kyc.profilePhoto,
      lastFour: String(aadhaar || '').slice(-4),
    },
  }
}
