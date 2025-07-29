<template>
  <div v-waterMarker="{ text: 'Frontend Template ', textColor: 'rgba(180, 180, 180, 0.6)' }" class="card">
    <span class="text">水印指令 🍇🍇🍇🍓🍓🍓</span>
  </div>
</template>

<script setup lang="ts" name="watermarkDirect">
definePage({
  meta: {
    title: '水印指令',
  },
})
</script>

<style scoped lang="scss"></style>
