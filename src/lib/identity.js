// Identity / official-email validation helpers.
//
// The admin (official) registration collects a government email. We treat a
// "real" official ID as one whose domain is a recognized Indian government
// domain. Anything else (including malformed/look-alike addresses such as
// "demo@gov.i") is flagged as an exception.

// Recognized Indian government domains (suffix match).
const GOV_DOMAINS = ['gov.in', 'nic.in']

// A few well-known public suffixes we never treat as "official".
const NON_GOV_TLDS = ['com', 'in', 'org', 'net', 'edu', 'co']

export function isValidEmailFormat(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

export function isGovernmentEmail(email) {
  if (!isValidEmailFormat(email)) return false
  const domain = String(email).trim().toLowerCase().split('@')[1] || ''
  return GOV_DOMAINS.some((d) => domain === d || domain.endsWith('.' + d))
}

export function domainOf(email) {
  return String(email || '').trim().toLowerCase().split('@')[1] || ''
}

// Returns a structured verdict used to drive the UI indicator.
//   level: 'ok' | 'warn' | 'error'
//   isReal: boolean  -> a genuine government official ID
export function analyzeOfficialEmail(email) {
  const value = String(email || '').trim()
  if (!value) {
    return { format: false, isGov: false, isReal: false, level: 'warn', message: 'Enter your official government email.' }
  }
  if (!isValidEmailFormat(value)) {
    return { format: false, isGov: false, isReal: false, level: 'error', message: 'That doesn’t look like a valid email address.' }
  }
  if (isGovernmentEmail(value)) {
    return { format: true, isGov: true, isReal: true, level: 'ok', message: 'Verified Government ID ✓' }
  }
  // Format is valid but it isn't a recognized government domain -> exception.
  return {
    format: true,
    isGov: false,
    isReal: false,
    level: 'error',
    message: 'This is not a government email. Use an official address ending in .gov.in (e.g. name@gov.in).',
  }
}
