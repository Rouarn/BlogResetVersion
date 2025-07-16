<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  initialItems: Api.Home.WorkItem[]
  isActiveType: string
}>()

const columnCount = ref(3) // 默认3列
const gap = ref(30) // 间距
const containerWidth = ref(0) // 容器宽度
const columnHeights = ref<number[]>([]) // 每列高度

const tableList = ref<Api.Home.WorkItem[]>(props.initialItems)

const getPicURL = (url: string) => {
  return new URL(url, import.meta.url).href
}

const containerRef = ref<HTMLDivElement>()
const tableItemRef = ref<HTMLDivElement[]>([])

// 根据屏幕宽度计算列数
const calculateColumnCount = () => {
  const width = window.innerWidth
  if (width < 640) {
    // 小屏设备
    return 1
  } else if (width < 1024) {
    // 中等屏幕
    return 2
  } // 大屏幕
  return 3
}

// 计算瀑布流位置
const calculatePosition = () => {
  if (!tableItemRef.value.length) return

  // 更新列数
  columnCount.value = calculateColumnCount()

  // 重置列高度
  columnHeights.value = Array.from({ length: columnCount.value }).fill(0) as number[]

  // 计算每项位置
  tableItemRef.value.forEach((item, _index) => {
    if (!item) return

    // 计算每项宽度 (减去间隙)
    const itemWidth = (containerWidth.value - gap.value * (columnCount.value - 1)) / columnCount.value

    // 找到最短的列
    const shortestColumnIndex = columnHeights.value.indexOf(Math.min(...columnHeights.value))

    // 设置项位置
    item.style.position = 'absolute'
    item.style.width = `${itemWidth}px`
    item.style.left = `${shortestColumnIndex * (itemWidth + gap.value)}px`
    item.style.top = `${columnHeights.value[shortestColumnIndex]}px`

    // 更新列高度
    columnHeights.value[shortestColumnIndex] += item.offsetHeight + gap.value
  })

  // 设置容器高度
  const container = tableItemRef.value[0]?.parentElement
  if (container) {
    container.style.height = `${Math.max(...columnHeights.value)}px`
  }
}

// 响应式调整
const handleResize = () => {
  const container = containerRef.value
  if (container) {
    containerWidth.value = container.offsetWidth
    calculatePosition()
  }
}

watch(
  () => props.isActiveType,
  () => {
    if (props.isActiveType === 'All') {
      tableList.value = props.initialItems
    } else {
      tableList.value = props.initialItems.filter((item) => item.type === props.isActiveType)
    }
    nextTick(() => {
      calculatePosition()
    })
  },
)

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="relative mx-auto max-w-1200px w-full px-4 sm:px-6">
    <!-- 瀑布流容器 -->
    <div ref="containerRef" class="relative w-full">
      <TransitionGroup name="zoom-fade">
        <div v-for="image in tableList" :key="image.id" ref="tableItemRef" class="tableItem transition-all duration-300 hover:shadow-lg">
          <NImage
            :src="getPicURL(image.url)"
            class="image block h-auto w-full"
            object-fit="cover"
            preview-disabled
            @load="handleResize()"
          />

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
.zoom-fade {
  &-move,
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

.tableItem {
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
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
  }
  .mask {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 1;
    transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    transform: translateY(100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
