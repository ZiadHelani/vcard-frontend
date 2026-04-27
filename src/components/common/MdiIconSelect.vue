<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  id: { type: String, default: undefined },
})

const emit = defineEmits(['update:modelValue'])

const update = (value) => {
  emit('update:modelValue', value)
}

const items = computed(() => [
  { title: 'Email', value: 'mdi:email-outline', icon: 'mdi:email-outline' },
  { title: 'Phone', value: 'mdi:phone', icon: 'mdi:phone' },

  // Social Media
  { title: 'TikTok', value: 'simple-icons:tiktok', icon: 'simple-icons:tiktok' },
  { title: 'Telegram', value: 'uil:telegram', icon: 'uil:telegram' },

  { title: 'Instagram', value: 'mdi:instagram', icon: 'mdi:instagram' },
  { title: 'Facebook', value: 'mdi:facebook', icon: 'mdi:facebook' },
  { title: 'Twitter / X', value: 'mdi:twitter', icon: 'mdi:twitter' },
  { title: 'LinkedIn', value: 'mdi:linkedin', icon: 'mdi:linkedin' },
  { title: 'Snapchat', value: 'mdi:snapchat', icon: 'mdi:snapchat' },
  { title: 'YouTube', value: 'mdi:youtube', icon: 'mdi:youtube' },
  { title: 'WhatsApp', value: 'mdi:whatsapp', icon: 'mdi:whatsapp' },
  { title: 'Messenger', value: 'mdi:facebook-messenger', icon: 'mdi:facebook-messenger' },
  { title: 'Reddit', value: 'mdi:reddit', icon: 'mdi:reddit' },
  { title: 'Pinterest', value: 'mdi:pinterest', icon: 'mdi:pinterest' },
  { title: 'Behance', value: 'mdi:behance', icon: 'mdi:behance' },
  { title: 'Spotify', value: 'mdi:spotify', icon: 'mdi:spotify' },
  { title: 'SoundCloud', value: 'mdi:soundcloud', icon: 'mdi:soundcloud' },
  { title: 'Discord', value: 'mdi:discord', icon: 'mdi:discord' },
  { title: 'GitHub', value: 'mdi:github', icon: 'mdi:github' },
  { title: 'GitLab', value: 'mdi:gitlab', icon: 'mdi:gitlab' },
  { title: 'StackOverflow', value: 'mdi:stack-overflow', icon: 'mdi:stack-overflow' },

  // Chat / Communication
  { title: 'Skype', value: 'mdi:skype', icon: 'mdi:skype' },
  { title: 'Zoom', value: 'mdi:video', icon: 'mdi:video' },
  { title: 'Slack', value: 'mdi:slack', icon: 'mdi:slack' },
  { title: 'WeChat', value: 'mdi:wechat', icon: 'mdi:wechat' },
  { title: 'Line', value: 'mdi:line-scan', icon: 'mdi:line-scan' },

  // Developer Platforms
  { title: 'NPM', value: 'mdi:npm', icon: 'mdi:npm' },
  { title: 'Docker', value: 'mdi:docker', icon: 'mdi:docker' },
  { title: 'Kubernetes', value: 'mdi:kubernetes', icon: 'mdi:kubernetes' },
  { title: 'VS Code', value: 'mdi:microsoft-visual-studio-code', icon: 'mdi:microsoft-visual-studio-code' },

  // Browsers
  { title: 'Google Chrome', value: 'mdi:google-chrome', icon: 'mdi:google-chrome' },
  { title: 'Firefox', value: 'mdi:firefox', icon: 'mdi:firefox' },
  { title: 'Safari', value: 'mdi:apple-safari', icon: 'mdi:apple-safari' },
  { title: 'Edge', value: 'mdi:microsoft-edge', icon: 'mdi:microsoft-edge' },

  // Stores
  { title: 'Google Play', value: 'mdi:google-play', icon: 'mdi:google-play' },
  { title: 'App Store', value: 'mdi:apple-ios', icon: 'mdi:apple-ios' },

  // Payment / Finance
  { title: 'PayPal', value: 'mdi:paypal', icon: 'mdi:paypal' },
  { title: 'Mastercard', value: 'mdi:credit-card', icon: 'mdi:credit-card' },
  { title: 'Visa', value: 'mdi:credit-card-outline', icon: 'mdi:credit-card-outline' },
  { title: 'Bitcoin', value: 'mdi:bitcoin', icon: 'mdi:bitcoin' },

  // Maps / Location
  { title: 'Google Maps', value: 'mdi:google-maps', icon: 'mdi:google-maps' },
  { title: 'Waze', value: 'mdi:waze', icon: 'mdi:waze' },
  { title: 'Location Pin', value: 'mdi:map-marker', icon: 'mdi:map-marker' },

  // Shopping
  { title: 'Amazon', value: 'mdi:amazon', icon: 'mdi:amazon' },
  { title: 'Shopify', value: 'mdi:shopify', icon: 'mdi:shopify' },
  { title: 'eBay', value: 'mdi:cart', icon: 'mdi:cart' },

  // Streaming
  { title: 'Netflix', value: 'mdi:netflix', icon: 'mdi:netflix' },
  { title: 'Twitch', value: 'mdi:twitch', icon: 'mdi:twitch' },
  { title: 'Apple TV', value: 'mdi:apple-tv', icon: 'mdi:apple-tv' },

  // Coding / Tools
  { title: 'Python', value: 'mdi:language-python', icon: 'mdi:language-python' },
  { title: 'JavaScript', value: 'mdi:language-javascript', icon: 'mdi:language-javascript' },
  { title: 'HTML5', value: 'mdi:language-html5', icon: 'mdi:language-html5' },
  { title: 'CSS3', value: 'mdi:language-css3', icon: 'mdi:language-css3' },
  { title: 'Vue.js', value: 'mdi:vuejs', icon: 'mdi:vuejs' },
  { title: 'React', value: 'mdi:react', icon: 'mdi:react' },
  { title: 'Node.js', value: 'mdi:nodejs', icon: 'mdi:nodejs' },

  // Misc
  { title: 'Website', value: 'mdi:web', icon: 'mdi:web' },
  { title: 'Calendar', value: 'mdi:calendar', icon: 'mdi:calendar' },
  { title: 'Address', value: 'mdi:home', icon: 'mdi:home' },
  { title: 'Fax', value: 'mdi:fax', icon: 'mdi:fax' },
  { title: 'Support', value: 'mdi:lifebuoy', icon: 'mdi:lifebuoy' },
  { title: 'Info', value: 'mdi:information-outline', icon: 'mdi:information-outline' },
])

</script>

<template>
  <v-autocomplete :id="id" :model-value="props.modelValue" @update:model-value="update" :items="items"
    item-title="title" item-value="value" variant="outlined" density="compact" hide-details clearable>
    <template #prepend-inner>
      <Icon icon="mdi:magnify" width="20" height="20" />
    </template>

    <template #item="{ props: itemProps, item }">
      <v-list-item v-bind="itemProps">
        <template #prepend>
          <Icon :icon="item.raw.icon" width="22" height="22" class="mr-2" />
        </template>
      </v-list-item>
    </template>

    <template #selection="{ item }">
      <div class="d-flex align-center">
        <Icon :icon="item.raw.icon" width="20" height="20" class="mr-1" />
        <span>{{ item.raw.title }}</span>
      </div>
    </template>
  </v-autocomplete>
</template>
