<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { NButton, NCard, NImage, NSpin, useMessage } from 'naive-ui';

interface Position {
  left: number;
  top: number;
}

// Props
const props = withDefaults(
  defineProps<{
    initialItems?: Api.Work.WorkItem[];
    itemWidth?: number; // 单位: %
    gutter?: number; // 单位: px
    loadMore?: () => Promise<Api.Work.WorkItem[]>;
  }>(),
  {
    initialItems: () => [],
    itemWidth: 33, // 33% 宽度
    gutter: 20,
    loadMore: () => Promise.resolve([])
  }
);

const emit = defineEmits<{
  (e: 'itemClick', item: Api.Work.WorkItem): void;
}>();

// Refs
const waterfallEl = ref<HTMLElement | null>(null);
const containerEl = ref<HTMLElement | null>(null);
const items = ref<Api.Work.WorkItem[]>(props.initialItems);
const positions = ref<Position[]>([]);
const columnHeights = ref<number[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const hasMore = ref(true);
const message = useMessage();

// Computed
const columnCount = computed(() => {
  if (!containerEl.value) return 3;
  return Math.max(1, Math.floor(100 / props.itemWidth));
});

const containerWidth = computed(() => {
  if (!containerEl.value) return 0;
  return containerEl.value.clientWidth;
});

// Methods
const calculatePositions = () => {
  if (!items.value.length || !containerEl.value || !waterfallEl.value) return;

  const actualItemWidth = (containerWidth.value * props.itemWidth) / 100;
  const actualGutter = props.gutter;

  // 初始化列高
  columnHeights.value = Array.from({ length: columnCount.value }).fill(0) as number[];
  positions.value = items.value.map(() => ({ left: 0, top: 0 }));

  items.value.forEach((item, index) => {
    // 找到当前最短的列
    const minHeight = Math.min(...columnHeights.value);
    const columnIndex = columnHeights.value.indexOf(minHeight);

    // 计算位置 (使用px单位)
    positions.value[index] = {
      left: columnIndex * (actualItemWidth + actualGutter),
      top: minHeight
    };

    // 更新列高 (如果高度未定义，使用默认高度)
    const itemHeight = item.height || 200;
    columnHeights.value[columnIndex] += itemHeight + actualGutter;
  });

  // 设置容器高度
  waterfallEl.value.style.height = `${Math.max(...columnHeights.value)}px`;
};

const handleImageLoad = async (index: number) => {
  await nextTick(); // 等待DOM更新

  if (!waterfallEl.value) return;

  const itemElement = waterfallEl.value.children[index] as HTMLElement;
  if (!itemElement) return;

  // 获取实际项目高度并更新
  const itemHeight = itemElement.offsetHeight;
  items.value[index].height = itemHeight;

  // 重新计算位置
  calculatePositions();
};

const handleResize = () => {
  calculatePositions();
};

const loadMore = async () => {
  if (!props.loadMore || loadingMore.value || !hasMore.value) return;

  try {
    loadingMore.value = true;
    const newItems = await props.loadMore();

    if (newItems.length === 0) {
      hasMore.value = false;
      message.info('没有更多数据了');
      return;
    }

    items.value = [...items.value, ...newItems];
    await nextTick();
    calculatePositions();
  } catch (error) {
    message.error(`加载更多数据失败${error}`);
  } finally {
    loadingMore.value = false;
  }
};

const handleItemClick = (item: Api.Work.WorkItem) => {
  emit('itemClick', item);
};

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', handleResize);
  calculatePositions();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Watch
watch(
  () => items.value.length,
  () => calculatePositions(),
  { deep: true }
);

watch([columnCount, containerWidth], calculatePositions);

// Expose
defineExpose({
  refreshLayout: calculatePositions
});
</script>

<template>
  <NSpin :show="loading">
    <!-- 外层容器用于居中 -->
    <div ref="containerEl" class="mx-auto max-w-[1200px] px-4">
      <!-- 瀑布流容器 -->
      <div ref="waterfallEl" class="relative">
        <!-- 瀑布流项目 -->
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="absolute bg-white shadow-sm transition-all duration-300"
          :style="{
            width: `${itemWidth}%`,
            left: `${positions[index]?.left ?? 0}px`,
            top: `${positions[index]?.top ?? 0}px`
          }"
          @click="handleItemClick(item)"
        >
          <NCard hoverable :content-style="{ padding: '12px' }">
            <template #cover>
              <NImage
                :src="item.image"
                :alt="item.title"
                class="w-full object-cover"
                :style="{ height: item.height ? `${item.height}px` : 'auto' }"
                @load="handleImageLoad(index)"
              />
            </template>
          </NCard>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="mt-4 text-center">
        <NButton :loading="loadingMore" @click="loadMore">加载更多</NButton>
      </div>
    </div>
  </NSpin>
</template>
