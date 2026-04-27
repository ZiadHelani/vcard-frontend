// stores/reorder.js
import { defineStore } from 'pinia'
import { reorderAPI } from '@/plugins/api/endpoints.js'
import { useToast } from 'vue-toastification'

export const useReorderStore = defineStore('reorder', {
  state: () => ({
    timers: {}, // per-model debounce timers
    delayMs: 700,
  }),

  actions: {
    // Ensure each item has an order = index + 1
    syncOrders(list) {
      list.forEach((item, idx) => {
        item.order = idx + 1
      })
    },

    // Build [{ model_id, order }] from a list
    buildPayload(list) {
      return list
        .map((item, idx) => ({ model_id: item.id ?? item.model_id, order: idx + 1 }))
        .filter((x) => x.model_id != null)
    },

    // Debounced POST to /reorder/{model}
    trigger(model, list) {
      const toast = useToast()
      const payload = this.buildPayload(list)
      if (payload.length === 0) return

      // clear existing timer
      if (this.timers[model]) {
        clearTimeout(this.timers[model])
      }

      this.timers[model] = setTimeout(async () => {
        try {
          await reorderAPI.reorder(model, payload)
        } catch (e) {
          toast.error(e?.response?.data?.message || `Failed to reorder ${model}s`)
        }
      }, this.delayMs)
    },

    // List operations with auto-sync + trigger
    moveUp(list, idx, model) {
      if (idx <= 0) return idx
      const tmp = list[idx]
      list[idx] = list[idx - 1]
      list[idx - 1] = tmp
      this.syncOrders(list)
      if (model) this.trigger(model, list)
      return idx - 1
    },

    moveDown(list, idx, model) {
      if (idx >= list.length - 1) return idx
      const tmp = list[idx]
      list[idx] = list[idx + 1]
      list[idx + 1] = tmp
      this.syncOrders(list)
      if (model) this.trigger(model, list)
      return idx + 1
    },

    removeAt(list, idx, model) {
      if (idx < 0 || idx >= list.length) return
      list.splice(idx, 1)
      this.syncOrders(list)
      if (model) this.trigger(model, list)
    },

    addItem(list, item, { syncOnly = false, model } = {}) {
      list.push(item)
      this.syncOrders(list)
      if (!syncOnly && model) this.trigger(model, list)
    },
  },
})
