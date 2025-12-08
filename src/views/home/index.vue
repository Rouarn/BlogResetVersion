<template>
  <div>
    <MdEditorWrapper v-model="modelValue" />
  </div>
</template>

<script setup lang="ts">
import MdEditorWrapper from '@/components/custom/md-editor.vue'

defineOptions({ name: 'Home' })

const modelValue = ref('')
</script>

<style lang="scss" scoped></style>
