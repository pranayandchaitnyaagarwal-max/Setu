// Fuzzy name comparison used in Step 6 of the Aadhaar e-KYC flow:
// compare the e-KYC name (from UIDAI) against the signed-in account name.
// Uses a Dice-coefficient over normalized name tokens with a configurable
// similarity threshold.

const HONORIFICS = new Set([
  'mr', 'mrs', 'ms', 'dr', 'shri', 'sri', 'smt', 'shrimati', 'late', 'prof', 'capt', 'major',
])

export function normalizeName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[.\-]/g, ' ')
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !HONORIFICS.has(t))
}

function similarity(a, b) {
  const ta = normalizeName(a)
  const tb = normalizeName(b)
  if (!ta.length || !tb.length) return 0
  const sa = new Set(ta)
  const sb = new Set(tb)
  let inter = 0
  sa.forEach((t) => { if (sb.has(t)) inter += 1 })
  return (2 * inter) / (sa.size + sb.size)
}

export function compareNames(aadhaarName, accountName, threshold = 0.85) {
  const score = similarity(aadhaarName, accountName)
  return { score, match: score >= threshold }
}
