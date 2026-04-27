// stores/config.js
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      rail: false,
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    toggleRail() {
      this.rail = !this.rail
    },

    getTextColor(backgroundColor) {
      // Convert hex to RGB
      const hex = backgroundColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)

      // Calculate luminance using the relative luminance formula
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

      // Return dark text for light backgrounds, light text for dark backgrounds
      return luminance > 0.5 ? '#000000' : '#FFFFFF'
    },
  },
})
