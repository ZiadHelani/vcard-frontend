<template>
  <div class="quill-editor-wrapper">
    <v-label v-if="label" class="text-xs text-black font-weight-bold mb-2">{{ label }}</v-label>
    <div class="quill-container">
      <QuillEditor
        ref="quillRef"
        v-model:content="content"
        toolbar="full"
        :placeholder="placeholder"
        content-type="html"
        @update:content="handleContentChange"
        class="custom-quill-editor"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Enter text...'
  },
  minHeight: {
    type: String,
    default: '120px'
  },
  toolbar: {
    type: [Array, String, Boolean],
    default: () => [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }],
      [{ 'header': [1, 2, 3, false] }],
      ['link'],
      ['clean']
    ]
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Refs
const quillRef = ref(null)

// Computed
const content = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Quill options
const quillOptions = computed(() => ({
  theme: 'snow',
  modules: {
    toolbar: props.toolbar
  },
  placeholder: props.placeholder,
  formats: [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'header', 'size',
    'link',
    'clean'
  ]
}))

// Methods
const handleContentChange = (newContent) => {
  emit('update:modelValue', newContent)
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (quillRef.value && newValue !== content.value) {
    content.value = newValue
  }
})
</script>

<style scoped>
.quill-editor-wrapper {
  margin-bottom: 1rem;
}

.quill-container {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

:deep(.ql-toolbar) {
  border: none;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: #f8f9fa;
  padding: 8px 12px;
}

:deep(.ql-container) {
  border: none;
  font-family: inherit;
  font-size: 14px;
  min-height: v-bind(minHeight);
}

:deep(.ql-editor) {
  padding: 12px 16px;
  line-height: 1.6;
  min-height: v-bind(minHeight);
}

:deep(.ql-editor.ql-blank::before) {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-style: normal;
  left: 16px;
}

:deep(.ql-toolbar .ql-formats) {
  margin-right: 12px;
}

:deep(.ql-toolbar button) {
  padding: 4px 6px;
  border-radius: 4px;
  margin: 0 1px;
}

:deep(.ql-toolbar button:hover) {
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

:deep(.ql-toolbar button.ql-active) {
  background: rgb(var(--v-theme-primary));
  color: white;
}

:deep(.ql-toolbar .ql-picker-label) {
  border-radius: 4px;
  padding: 4px 8px;
}

:deep(.ql-toolbar .ql-picker-label:hover) {
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

:deep(.ql-snow .ql-tooltip) {
  background: white;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.ql-snow .ql-tooltip input) {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  padding: 8px 12px;
}

/* Focus styles */
.quill-container:focus-within {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
}

/* Custom scrollbar for editor */
:deep(.ql-editor) {
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--v-theme-primary), 0.3) transparent;
}

:deep(.ql-editor::-webkit-scrollbar) {
  width: 6px;
}

:deep(.ql-editor::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.ql-editor::-webkit-scrollbar-thumb) {
  background: rgba(var(--v-theme-primary), 0.3);
  border-radius: 3px;
}

:deep(.ql-editor::-webkit-scrollbar-thumb:hover) {
  background: rgba(var(--v-theme-primary), 0.5);
}
</style>
