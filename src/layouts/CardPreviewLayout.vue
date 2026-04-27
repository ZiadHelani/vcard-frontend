<script setup>
import '@vueup/vue-quill/dist/vue-quill.snow.css'
</script>

<template>
  <div dir="ltr" class="card-preview-layout">
    <RouterView />
  </div>
</template>

<style scoped>
.card-preview-layout {
  direction: ltr !important;
}

/* Quill Editor Styles for Card Preview */
.card-preview-layout :deep(.ql-editor) {
  padding: 0;
  line-height: 1.6;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
}

.card-preview-layout :deep(.ql-editor p) {
  margin-bottom: 0.5em;
}

.card-preview-layout :deep(.ql-editor p:last-child) {
  margin-bottom: 0;
}

.card-preview-layout :deep(.ql-editor h1),
.card-preview-layout :deep(.ql-editor h2),
.card-preview-layout :deep(.ql-editor h3),
.card-preview-layout :deep(.ql-editor h4),
.card-preview-layout :deep(.ql-editor h5),
.card-preview-layout :deep(.ql-editor h6) {
  font-weight: bold;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.card-preview-layout :deep(.ql-editor h1) {
  font-size: 2em;
}

.card-preview-layout :deep(.ql-editor h2) {
  font-size: 1.5em;
}

.card-preview-layout :deep(.ql-editor h3) {
  font-size: 1.17em;
}

.card-preview-layout :deep(.ql-editor strong) {
  font-weight: bold;
}

.card-preview-layout :deep(.ql-editor em) {
  font-style: italic;
}

.card-preview-layout :deep(.ql-editor u) {
  text-decoration: underline;
}

.card-preview-layout :deep(.ql-editor s) {
  text-decoration: line-through;
}

.card-preview-layout :deep(.ql-editor a) {
  color: inherit;
  text-decoration: underline;
}

.card-preview-layout :deep(.ql-editor ul),
.card-preview-layout :deep(.ql-editor ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.card-preview-layout :deep(.ql-editor ul) {
  list-style-type: disc;
}

.card-preview-layout :deep(.ql-editor ol) {
  list-style-type: decimal;
}

.card-preview-layout :deep(.ql-editor li) {
  margin: 0.25em 0;
}

.card-preview-layout :deep(.ql-editor blockquote) {
  border-left: 4px solid #ccc;
  margin: 0.5em 0;
  padding-left: 1em;
  font-style: italic;
}

.card-preview-layout :deep(.ql-editor code) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}

.card-preview-layout :deep(.ql-editor pre) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
}

.card-preview-layout :deep(.ql-editor img) {
  max-width: 100%;
  height: auto;
}

/* Ensure text alignment is left for LTR */
.card-preview-layout :deep(.ql-editor) {
  text-align: left !important;
  direction: ltr !important;
}

/* Override any RTL styles that might affect the editor */
.card-preview-layout :deep(.ql-editor *[dir='rtl']) {
  direction: ltr !important;
  text-align: left !important;
}
</style>
