<route lang="json5">
{
  meta: {
    title: '复制指令',
    group: {
      enabled: true,
      title: '自定义指令',
      icon: 'material-icon-theme:folder-vue-directives-open',
      i18nKey: 'route.directives',
      order: 2,
    },
  },
}
</route>

<template>
  <div class="card">
    <span class="text">复制指令 🍇🍇🍇🍓🍓🍓</span>
    <div class="box-content">
      <NInput v-model="data" placeholder="请输入内容" style="width: 500px">
        <template #suffix>
          <NButton v-copy="data"> 复制 </NButton>
        </template>
      </NInput>
    </div>
  </div>
</template>

<script setup lang="ts" name="copyDirect">
import { ref } from 'vue'

const data = ref<string>('我是被复制的内容 🍒 🍉 🍊')
</script>

<style scoped lang="scss"></style>
