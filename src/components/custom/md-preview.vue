<template>
  <MdPreview :model-value="modelValue" :preview-theme="previewTheme" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import 'md-editor-v3/lib/preview.css'
import { MdPreview } from 'md-editor-v3'

defineOptions({ name: 'MdPreviewWrapper' })

interface Props {
  modelValue?: string
  previewTheme?: string
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  previewTheme: 'github',
})

const modelValue = computed(() => props.modelValue)
const previewTheme = computed(() => props.previewTheme)
</script>

<style lang="scss" scoped></style>
