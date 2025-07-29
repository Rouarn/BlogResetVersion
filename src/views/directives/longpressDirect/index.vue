<template>
  <div class="card">
    <span class="text">长按指令 🍇🍇🍇🍓🍓🍓</span>
    <NButton v-longpress="longpress" type="primary"> 长按2秒触发事件 </NButton>
  </div>
</template>

<script setup lang="ts" name="longpressDirect">
definePage({
  meta: {
    title: '长按指令',
  },
})

const longpress = () => {
  window.$message?.success('长按事件触发成功 🎉🎉🎉')
}
</script>

<style scoped lang="scss"></style>
