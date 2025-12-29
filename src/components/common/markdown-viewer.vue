<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/modules/theme'
import 'md-editor-v3/lib/preview.css'
import { MdPreview } from 'md-editor-v3'

defineOptions({
  name: 'MarkdownViewer',
})

interface Props {
  content: string
}

const props = defineProps<Props>()

const themeStore = useThemeStore()
const theme = computed(() => (themeStore.darkMode ? 'dark' : 'light'))
</script>

<template>
  <div class="markdown-viewer">
    <MdPreview :model-value="props.content" :theme="theme" class="!bg-transparent" />
  </div>
</template>

<style scoped>
:deep(.md-editor-preview-wrapper) {
  padding: 0;
}
</style>
