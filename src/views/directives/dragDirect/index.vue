<template>
  <div class="card relative">
    <span class="text">拖拽指令 🍇🍇🍇🍓🍓🍓</span>
    <div v-draggable class="drag-box flex-center">我可以拖拽哦~</div>
  </div>
</template>

<script setup lang="ts" name="dragDirect">
definePage({
  meta: {
    layout: 'base-layout',
    title: '拖拽指令',
  },
})
</script>

<style scoped lang="scss">
.drag-box {
  position: absolute;
  top: 110px;
  width: 300px;
  height: 300px;
  font-size: 23px;
  font-weight: bold;
  color: rgb(var(--primary-300-color));
  background: rgb(var(--info-700-color));
  border-radius: 50%;
}
</style>
