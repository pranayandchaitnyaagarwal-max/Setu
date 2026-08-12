'use client'

import { useLanguage } from './language'
import { uiTranslations } from './ui.translations'

// Map our language codes to BCP-47 tags for the Web Speech API.
export const SPEECH_LANG = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  as: 'as-IN',
  brx: 'hi-IN',
  doi: 'hi-IN',
  kok: 'kok-IN',
  ks: 'ks-IN',
  mai: 'hi-IN',
  mni: 'hi-IN',
  ne: 'ne-NP',
  or: 'or-IN',
  sa: 'sa-IN',
  sat: 'hi-IN',
  sd: 'sd-IN',
  ur: 'ur-PK',
}

export function speechLangFor(code) {
  return SPEECH_LANG[code] || 'en-IN'
}

export function useUi() {
  const { lang } = useLanguage()
  const dict = uiTranslations[lang]
  const en = uiTranslations.en
  const u = (key) => {
    if (dict && dict[key] != null && dict[key] !== '') return dict[key]
    if (en && en[key] != null) return en[key]
    return key
  }
  return { u, lang, speechLang: speechLangFor(lang) }
}
