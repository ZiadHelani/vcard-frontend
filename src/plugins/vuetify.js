import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { VFileUpload } from 'vuetify/labs/VFileUpload'

import { ar, en, he } from 'vuetify/locale'


// primary: '#3b82f6',
// 'primary-darken-1': '#1565C0',
//   'primary-lighten-1': '#42A5F5',
// Custom theme configuration
const customTheme = {
  dark: false,
  colors: {
    // Primary colors - customize these as needed
    primary: '#7239D6',

    'primary-darken-1': '#5A2EAB',
    'primary-lighten-1': '#8F60E0',

    // Secondary colors - customize these as needed
    secondary: '#424242',
    'secondary-darken-1': '#212121',
    'secondary-lighten-1': '#616161',

    // Additional theme colors
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#05DF72',
    warning: '#FFC107',

    black: '#000000',
    white: '#FFFFFF',
    'grey-50': '#FAFAFA',
    'grey-100': '#F5F5F5',
    'grey-200': '#EEEEEE',
    'grey-300': '#E0E0E0',
    'grey-400': '#BDBDBD',
    'grey-500': '#9E9E9E',
    'grey-600': '#757575',
    'grey-700': '#616161',
    'grey-800': '#424242',
    'grey-900': '#212121',

    // Purple colors
    purple: '#9C27B0',
    'purple-darken-1': '#7B1FA2',
    'purple-darken-2': '#6A1B9A',
    'purple-lighten-1': '#AB47BC',
    'purple-lighten-2': '#BA68C8',

    // Surface colors
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-light': '#FDFDFE',
    'surface-variant': '#424242',
    'on-surface-variant': '#EEEEEE',
  },
  variables: {
    'border-color': '#000000',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.6,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212529',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#F5F5F5',
    'theme-on-code': '#000000',
  },
}

// Dark theme configuration
const darkTheme = {
  dark: true,
  colors: {
    primary: '#2196F3',
    'primary-darken-1': '#1976D2',
    'primary-lighten-1': '#64B5F6',

    secondary: '#616161',
    'secondary-darken-1': '#424242',
    'secondary-lighten-1': '#757575',

    accent: '#FF4081',
    error: '#FF5252',
    info: '#2196F3',
    success: '#05DF72',
    warning: '#FB8C00',

    surface: '#121212',
    'surface-bright': '#ccbfd6',
    'surface-light': '#424242',
    'surface-variant': '#a3a3a3',
    'on-surface-variant': '#424242',
  },
}

const vuetify = createVuetify({
  locale: {
    locale: 'en',
    fallback: 'ar',
    messages: { ar, en, he },
  },
  components: {
    ...components,
    VFileUpload,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme,
      dark: darkTheme,
    },
  },
  defaults: {
    VBtn: {
      color: 'primary',
      variant: 'elevated',
      ripple: false,
    },
    VCard: {
      variant: 'elevated',
    },
    VTextField: {
      variant: 'outlined',
      rounded: 'lg',
      hideDetails: 'auto',
      density: 'compact',
    },
    VSelect: {
      variant: 'outlined',
      rounded: 'lg',
      hideDetails: 'auto',
      density: 'compact',
    },
    VTextarea: {
      variant: 'outlined',
      rounded: 'lg',
      hideDetails: 'auto',
      density: 'compact',
    },
    VChip: {
      density: 'compact',
    },
  },
})

export default vuetify
