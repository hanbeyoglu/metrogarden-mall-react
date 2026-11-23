import { useTranslation } from 'react-i18next'

export type SupportedLanguage = 'tr' | 'en'

export function useLanguage() {
  const { i18n } = useTranslation()

  const currentLanguage = i18n.language.startsWith('en') ? 'en' : ('tr' as SupportedLanguage)

  function changeLanguage(lang: SupportedLanguage) {
    void i18n.changeLanguage(lang)
  }

  return { currentLanguage, changeLanguage }
}
