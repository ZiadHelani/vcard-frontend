import { createI18n } from 'vue-i18n'

// Import locale messages
import en from '@/locales/en'
import ar from '@/locales/ar'
import he from '@/locales/he'

// Available locales configuration
export const SUPPORTED_LOCALES = [
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'he', name: 'עברית', flag: '🇮🇱', dir: 'rtl' },
]

// Get saved locale from localStorage or detect from browser
const getSavedLocale = () => {
  const saved = localStorage.getItem('user-locale')
  if (saved && SUPPORTED_LOCALES.find((l) => l.code === saved)) {
    return saved
  }

  // Fallback to browser language
  const browserLocale = navigator.language.split('-')[0]
  if (SUPPORTED_LOCALES.find((l) => l.code === browserLocale)) {
    return browserLocale
  }

  // Default to English
  return 'en'
}

// Helper function to apply direction consistently
const applyDirection = (locale, direction) => {
  // Force update document direction and lang
  if (document.documentElement) {
    document.documentElement.setAttribute('dir', direction)
    document.documentElement.setAttribute('lang', locale)
    // Also add a class for CSS targeting
    document.documentElement.classList.remove('rtl', 'ltr')
    document.documentElement.classList.add(direction)
  }

  // Only set body attribute if body exists
  if (document.body) {
    document.body.setAttribute('dir', direction)
  }
}

// Get initial locale
const initialLocale = getSavedLocale()
const initialLocaleConfig = SUPPORTED_LOCALES.find((l) => l.code === initialLocale)

// Set direction immediately before Vue renders (synchronously)
if (initialLocaleConfig && typeof document !== 'undefined') {
  applyDirection(initialLocale, initialLocaleConfig.dir)
  console.log('🚀 Initial locale set:', initialLocale, 'Direction:', initialLocaleConfig.dir)
}

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    en,
    ar,
    he,
  },
})

// Helper to set locale and persist
export const setLocale = (locale) => {
  if (!SUPPORTED_LOCALES.find((l) => l.code === locale)) {
    return
  }

  i18n.global.locale.value = locale
  localStorage.setItem('user-locale', locale)

  // Set document direction and lang attribute
  const localeConfig = SUPPORTED_LOCALES.find((l) => l.code === locale)
  if (localeConfig) {
    const direction = localeConfig.dir
    applyDirection(locale, direction)
    console.log('🌍 Locale changed to:', locale, 'Direction:', direction)
  }
}

// Initialize document direction and lang on load (as backup)
const initLocale = () => {
  const locale = i18n.global.locale.value
  const localeConfig = SUPPORTED_LOCALES.find((l) => l.code === locale)
  if (localeConfig && typeof document !== 'undefined') {
    const direction = localeConfig.dir

    // Ensure direction is set (in case it wasn't set earlier)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        applyDirection(locale, direction)
      })
    } else {
      // DOM is already ready
      applyDirection(locale, direction)
    }
  }
}

// Export applyDirection for use in setLocale
export const applyDocumentDirection = applyDirection

// Initialize as backup (runs after module load)
initLocale()

export default i18n
