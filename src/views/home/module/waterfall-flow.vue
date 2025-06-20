<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  initialItems: Api.Work.WorkItem[];
  isActiveType: string;
}>();

const columnCount = ref(3); // 默认3列
const gap = ref(16); // 间距
const containerWidth = ref(0); // 容器宽度
const columnHeights = ref<number[]>([]); // 每列高度

const tableList = ref<Api.Work.WorkItem[]>(props.initialItems);

const getPicURL = (url: string) => {
  return new URL(url, import.meta.url).href;
};

const containerRef = ref<HTMLDivElement>();
const tableItemRef = ref<HTMLDivElement[]>([]);

// 计算瀑布流位置
const calculatePosition = () => {
  if (!tableItemRef.value.length) return;

  // 重置列高度
  columnHeights.value = Array.from({ length: columnCount.value }).fill(0) as number[];

  // 计算每项位置
  tableItemRef.value.forEach((item, _index) => {
    if (!item) return;

    // 计算每项宽度 (减去间隙)
    const itemWidth = (containerWidth.value - gap.value * (columnCount.value - 1)) / columnCount.value;

    // 找到最短的列
    const shortestColumnIndex = columnHeights.value.indexOf(Math.min(...columnHeights.value));

    // 设置项位置
    item.style.position = 'absolute';
    item.style.width = `${itemWidth}px`;
    item.style.left = `${shortestColumnIndex * (itemWidth + gap.value)}px`;
    item.style.top = `${columnHeights.value[shortestColumnIndex]}px`;

    // 更新列高度
    columnHeights.value[shortestColumnIndex] += item.offsetHeight + gap.value;
  });

  // 设置容器高度
  const container = tableItemRef.value[0]?.parentElement;
  if (container) {
    container.style.height = `${Math.max(...columnHeights.value)}px`;
  }
};

// 响应式调整
const handleResize = () => {
  const container = containerRef.value;
  if (container) {
    containerWidth.value = container.offsetWidth;
    calculatePosition();
  }
};

watch(
  () => props.isActiveType,
  () => {
    if (props.isActiveType === 'All') {
      tableList.value = props.initialItems;
    } else {
      tableList.value = props.initialItems.filter(item => item.type === props.isActiveType);
    }
    nextTick(() => {
      calculatePosition();
    });
  }
);

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div class="relative mx-auto max-w-1200px w-full">
    <!-- 瀑布流容器 -->
    <div ref="containerRef" class="relative w-full">
      <TransitionGroup name="zoom-fade">
        <div v-for="image in tableList" :key="image.id" ref="tableItemRef" class="transition-all duration-300">
          <NImage
            :src="getPicURL(image.url)"
            class="block h-auto w-full rounded-lg shadow-md transition-shadow hover:shadow-lg"
            object-fit="cover"
            preview-disabled
            @load="handleResize()"
          />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.zoom-fade {
  &-move, /* 对移动中的元素应用的过渡 */
  &-enter-active,
  &-leave-active {
    transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }

  &-leave-active {
    position: absolute;
  }
}
</style>
