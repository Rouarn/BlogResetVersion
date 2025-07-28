<template>
  <div class="card">
    <span class="text">节流指令 🍇🍇🍇🍓🍓🍓</span>
    <NButton v-throttle="throttleClick" type="primary"> 节流按钮 (每隔1S秒后执行) </NButton>
  </div>
</template>

<script setup lang="ts" name="throttleDirect">
definePage({
  meta: {
    layout: 'base-layout',
    title: '节流指令',
  },
})

const throttleClick = () => {
  window.$message?.success('我是节流按钮触发的事件 🍍🍓🍌')
}
</script>

<style scoped lang="scss"></style>
