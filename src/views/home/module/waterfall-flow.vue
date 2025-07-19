<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps<{
  initialItems: Api.Home.WorkItem[]
  isActiveType: string
}>()

const containerRef = ref<HTMLDivElement>()
const tableList = ref<Api.Home.WorkItem[]>(props.initialItems)

const getPicURL = (url: string) => {
  return new URL(url, import.meta.url).href
}

// 响应式调整 - 主要处理过滤逻辑
watch(
  () => props.isActiveType,
  () => {
    if (props.isActiveType === 'All') {
      tableList.value = props.initialItems
    } else {
      tableList.value = props.initialItems.filter((item) => item.type === props.isActiveType)
    }
  },
)

const handleResize = () => {
  // CSS Columns会自动根据容器宽度调整布局
  // 这里可以添加其他响应式逻辑，如果需要的话
}
</script>

<template>
  <div class="relative mx-auto max-w-1200px w-full px-4 sm:px-6">
    <!-- 瀑布流容器 - 使用CSS columns实现简单瀑布流 -->
    <div ref="containerRef" class="relative w-full waterfall-columns">
      <TransitionGroup name="zoom-fade">
        <div v-for="image in tableList" :key="image.id" class="tableItem transition-all duration-300 hover:shadow-lg">
          <img :src="getPicURL(image.url)" class="image block h-auto w-full" @load="handleResize()" />
          <div class="mask">
            <NP class="m-0 c-[var(--un-ring-offset-color)] uppercase">Web Design</NP>
            <NH4 class="m-0 my-10px text-1.125rem c-[var(--un-ring-offset-color)] font-700 uppercase"> Brand Redesign Works </NH4>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// CSS columns实现简单瀑布流
.waterfall-columns {
  --columns: 3;
  --column-gap: 30px;
  column-count: var(--columns);
  column-gap: var(--column-gap);
  row-gap: 30px;
}

// 响应式调整列数
@media (max-width: 1024px) {
  .waterfall-columns {
    column-count: 2;
  }
}

@media (max-width: 640px) {
  .waterfall-columns {
    column-count: 1;
  }
}

.tableItem {
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: var(--column-gap); // 列之间的间隙
  break-inside: avoid; // 防止元素在列中间被分割
  position: relative; // 为mask定位提供上下文

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 0;
    transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    background-color: rgba($color: #000000, $alpha: 0.8);
  }
  .image {
    transform: rotate(0) scale(1);
    transition: all 0.3s ease-out 0s;
    width: 100%; // 确保图片填充整个项目
    height: auto;
    display: block; // 去除底部间隙
  }
  .mask {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px; // 添加一些内边距
    z-index: 0;
    opacity: 1;
    transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    transform: translateY(100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: transparent; // 透明背景，让::after伪元素显示
  }
  &:hover {
    &::after {
      opacity: 1;
      z-index: 1;
    }
    & .image {
      transform: rotate(-5deg) scale(1.2);
    }
    & .mask {
      z-index: 2;
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
