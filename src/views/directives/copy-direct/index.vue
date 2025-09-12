<script setup lang="ts" name="copyDirect">
import { ref } from 'vue'

definePage({
  meta: {
    title: '复制指令',
    i18nKey: 'route.copyDirect',
    order: 1,
  },
})

const data = ref<string>('我是被复制的内容 🍒 🍉 🍊')
</script>

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

<style scoped lang="scss"></style>
