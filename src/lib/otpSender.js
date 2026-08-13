// Real OTP delivery via Twilio (SMS) and/or SMTP (email).
// Both are optional: if neither is configured, the caller falls back to demo mode
// (the OTP is returned to the client for display).

let nodemailer

export function smsConfigured() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
  )
}

export function emailConfigured() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  )
}

async function sendSms({ to, body }) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } =
    process.env
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
  const params = new URLSearchParams()
  params.append('To', to)
  params.append('From', TWILIO_PHONE_NUMBER)
  params.append('Body', body)
  const auth = Buffer.from(
    `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
  ).toString('base64')
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Twilio error: ${text}`)
  }
  return true
}

export async function sendEmail({ to, subject, text }) {
  if (!nodemailer) {
    const mod = await import('nodemailer')
    nodemailer = mod.default
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  })
  return true
}

// Delivers the OTP. Returns { delivered, channel }.
// channel is 'sms' | 'email' | 'demo'.
export async function deliverOtp({ phone, email, otp }) {
  const message =
    `Your SETU verification OTP is ${otp}. It is valid for 5 minutes. Do not share it with anyone.`

  if (phone && smsConfigured()) {
    try {
      await sendSms({ to: phone, body: message })
      return { delivered: true, channel: 'sms' }
    } catch (e) {
      // fall through to email / demo
    }
  }
  if (email && emailConfigured()) {
    try {
      await sendEmail({
        to: email,
        subject: 'SETU OTP Verification',
        text: message,
      })
      return { delivered: true, channel: 'email' }
    } catch (e) {
      // fall through to demo
    }
  }
  return { delivered: false, channel: 'demo' }
}
