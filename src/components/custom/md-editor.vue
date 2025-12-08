<template>
  <div class="md-editor-wrapper">
    <MdEditor v-model="modelValue" :preview-theme="'github'" :toolbars-exclude="[]" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import 'md-editor-v3/lib/style.css'
import { MdEditor } from 'md-editor-v3'

defineOptions({ name: 'MdEditorWrapper' })

interface Props {
  modelValue: string
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
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
