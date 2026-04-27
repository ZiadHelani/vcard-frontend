import { computed } from 'vue'
import { useI18n as vueUseI18n } from 'vue-i18n'
import { setLocale, SUPPORTED_LOCALES } from '@/plugins/i18n'

/**
 * Custom composable for easy i18n usage throughout the app
 * Provides translation functions and locale management
 */
export function useI18n() {
  const { t, locale, tm } = vueUseI18n()

  // Current locale code
  const currentLocale = computed(() => locale.value)

  // Current locale configuration (name, flag, dir)
  const currentLocaleConfig = computed(() => {
    return SUPPORTED_LOCALES.find((l) => l.code === locale.value) || SUPPORTED_LOCALES[0]
  })

  // Check if current locale is RTL
  const isRTL = computed(() => currentLocaleConfig.value.dir === 'rtl')

  // Available locales
  const availableLocales = computed(() => SUPPORTED_LOCALES)

  /**
   * Change the current locale
   * @param {string} newLocale - The locale code to switch to
   */
  const changeLocale = (newLocale) => {
    if (SUPPORTED_LOCALES.find((l) => l.code === newLocale)) {
      setLocale(newLocale)
    }
  }

  /**
   * Toggle between available locales
   */
  const toggleLocale = () => {
    const currentIndex = SUPPORTED_LOCALES.findIndex((l) => l.code === locale.value)
    const nextIndex = (currentIndex + 1) % SUPPORTED_LOCALES.length
    changeLocale(SUPPORTED_LOCALES[nextIndex].code)
  }

  /**
   * Get translation for a key
   * @param {string} key - Translation key (e.g., 'common.welcome')
   * @param {object} values - Values for interpolation
   * @returns {string} Translated text
   */
  const translate = (key, values) => {
    return t(key, values)
  }

  /**
   * Get translation object for a key
   * @param {string} key - Translation key
   * @returns {object} Translation object
   */
  const translateObject = (key) => {
    return tm(key)
  }

  /**
   * Check if a translation key exists
   * @param {string} key - Translation key
   * @returns {boolean}
   */
  const hasTranslation = (key) => {
    return t(key) !== key
  }

  return {
    // Translation functions
    t: translate,
    tm: translateObject,
    hasTranslation,

    // Locale management
    locale: currentLocale,
    localeConfig: currentLocaleConfig,
    changeLocale,
    toggleLocale,
    availableLocales,

    // RTL support
    isRTL,
  }
}

export default useI18n
