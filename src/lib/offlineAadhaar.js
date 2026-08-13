// Offline Aadhaar (Paperless e-KYC) verification — server-side only.
//
// The resident downloads a digitally signed XML from myAadhaar
// (https://myaadhaar.uidai.gov.in/offline-ekyc). We verify its XML-DSig
// signature against UIDAI's OFFICIAL offline e-KYC public key (pinned below,
// "DS Unique Identification Authority of India 06", valid 2026-02-03 →
// 2029-02-03) and parse the demographics. This proves the document is genuine
// UIDAI-issued and untampered, without needing a KUA licence or any cost.
//
// We deliberately verify against the PINNED UIDAI cert (not the certificate
// embedded in the file) so a tampered/forged file cannot pass verification.

import { SignedXml } from 'xml-crypto'
import { XMLParser } from 'fast-xml-parser'
import { UIDAI_OFFLINE_PUBLIC_KEY } from './uidaiKey'

// UIDAI Offline e-KYC public key ("DS Unique Identification Authority of
// India 06"), valid 2026-02-03 → 2029-02-03. Generated from the official
// uidai-offline-publickey.pem so it is always available in serverless.
const PUBLIC_KEY_PEM = UIDAI_OFFLINE_PUBLIC_KEY

// Forward-compatible field names across UIDAI schema versions.
const ADDRESS_FIELDS = ['co', 'house', 'street', 'lm', 'loc', 'vtc', 'po', 'subdist', 'dist', 'state', 'pc', 'country']

export function maskAadhaar(uid = '') {
  const digits = String(uid).replace(/\D/g, '')
  if (digits.length >= 12) return `XXXX XXXX ${digits.slice(-4)}`
  const raw = String(uid).replace(/\s+/g, ' ')
  if (/x/i.test(raw) && raw.includes(' ')) return raw.toUpperCase()
  return raw
}

function findRoot(obj) {
  return obj?.OfflinePaperlessKyc || obj?.OffLineAadhaar || obj?.UidData?.parent || null
}

export function verifyOfflineAadhaar(xml) {
  if (!xml || typeof xml !== 'string' || !xml.includes('<')) {
    return { ok: false, error: 'No Aadhaar XML provided.' }
  }

  // 1) Verify the enveloped XML-DSig signature against UIDAI's pinned cert.
  try {
    const sigMatch = xml.match(/<Signature[\s\S]*?<\/Signature>/)
    if (!sigMatch) {
      return { ok: false, error: 'No digital signature found in the document.' }
    }
    const sig = new SignedXml()
    sig.publicCert = PUBLIC_KEY_PEM
    sig.loadSignature(sigMatch[0])
    const valid = sig.checkSignature(xml)
    if (!valid) {
      return {
        ok: false,
        signedByUidai: false,
        error: 'Digital signature is INVALID. This file is not a genuine UIDAI document or has been tampered with.',
        validationErrors: sig.validationErrors,
      }
    }
  } catch (e) {
    return { ok: false, error: 'Could not validate the digital signature: ' + (e.message || e) }
  }

  // 2) Parse the (now trusted) demographics.
  let parsed
  try {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' })
    parsed = parser.parse(xml)
  } catch (e) {
    return { ok: false, error: 'Could not parse the Aadhaar XML: ' + (e.message || e) }
  }

  const root = parsed?.OfflinePaperlessKyc || parsed?.OffLineAadhaar || {}
  const uidData = root.UidData || {}
  const poi = uidData.Poi || {}
  const poa = uidData.Poa || {}

  const uid = root.uid || poi.uid || ''
  const name = (poi.name || '').trim()
  const dob = poi.dob || ''
  const gender = poi.gender || ''

  const addressParts = []
  for (const f of ADDRESS_FIELDS) {
    const v = (poa[f] || '').toString().trim()
    if (v) addressParts.push(v)
  }
  const address = addressParts.join(', ')

  if (!uid || !name) {
    return { ok: false, error: 'The Aadhaar XML is missing required fields (uid/name).' }
  }

  return {
    ok: true,
    signedByUidai: true,
    maskedAadhaar: maskAadhaar(uid),
    name,
    dob,
    gender,
    address,
    referenceId: root.referenceId || '',
    ts: root.ts || '',
  }
}
