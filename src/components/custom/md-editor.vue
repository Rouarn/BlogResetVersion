<template>
  <MdEditor v-model="modelValue" :preview-theme="previewTheme" :toolbars-exclude="[]" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import 'md-editor-v3/lib/style.css'
import { MdEditor } from 'md-editor-v3'

defineOptions({ name: 'MdEditorWrapper' })

interface Props {
  modelValue?: string
  previewTheme?: string
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  previewTheme: 'github',
})

type Emits = {
  (e: 'update:modelValue', v: string): void
}
const emit = defineEmits<Emits>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>

<style lang="scss" scoped></style>
