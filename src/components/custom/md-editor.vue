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
  modelValue?: string
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: `# 🚀 Frontend Template

基于 **Vue 3 + Vite + TypeScript** 构建的现代化前端开发模板，内置路由分组与国际化约定、后端路由数据驱动与视图组件自动解析，并配套丰富的开箱即用功能，助力快速启动项目开发。`,
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
