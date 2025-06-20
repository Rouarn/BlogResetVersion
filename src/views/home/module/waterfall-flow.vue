<script lang="ts" setup>
import { onMounted } from 'vue';

onMounted(() => {
  // grid布局
  const masonry = document.querySelector('.masonry_2') as HTMLElement;
  const items = masonry.querySelectorAll('.masonry_2 .item') as NodeListOf<HTMLElement>;
  items.forEach((item: HTMLElement) => {
    // 模拟高度获取，若为图片可获取图片高度
    const height = Math.floor(Math.random() * 300 + 50);
    // 根据元素高度设置元素的需占行数
    const rows = Math.ceil(height / 10);
    (item as HTMLElement).style.gridRowStart = `span ${rows}`;
  });
});
</script>

<template>
  <div class="masonry_2">
    <div v-for="(item, index) in 20" :key="index" class="item">
      {{ index }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.masonry_2 {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  grid-auto-rows: 10px;
  .item {
    background: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
