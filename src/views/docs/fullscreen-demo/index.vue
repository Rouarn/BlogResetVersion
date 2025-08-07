<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useFullscreen } from '@vueuse/core'

definePage({
  meta: {
    title: '全屏演示',
    isFull: true,
    icon: 'material-symbols:fullscreen',
    order: 10,
  },
})

const { isFullscreen, exit, toggle } = useFullscreen()
const animationActive = ref(false)
const currentTime = ref(new Date())
const timeInterval = ref<ReturnType<typeof setInterval> | null>(null)

// 处理退出全屏
function handleExitFullscreen() {
  if (isFullscreen.value) {
    exit()
  }
}

// 触发动画效果
function triggerAnimation() {
  animationActive.value = true
  setTimeout(() => {
    animationActive.value = false
  }, 1000)
}

// 更新当前时间
function updateTime() {
  currentTime.value = new Date()
}

onMounted(() => {
  // 每秒更新一次时间
  timeInterval.value = setInterval(updateTime, 1000)
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timeInterval.value) {
    clearInterval(timeInterval.value)
  }
})
</script>

<template>
  <div
    class="min-h-screen relative h-full bg-gray-50 dark:bg-dark-900 text-gray-800 dark:text-gray-200 transition-all duration-500"
    :class="{ 'animate-pulse': animationActive }"
  >
    <div class="container mx-auto px-4 py-8 h-full flex flex-col relative">
      <!-- 装饰元素 -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="floating-circle bg-gray-200 dark:bg-dark-700 opacity-20 w-64 h-64 rounded-full absolute -top-20 -left-20"></div>
        <div class="floating-circle-slow bg-gray-300 dark:bg-dark-600 opacity-10 w-96 h-96 rounded-full absolute top-1/3 -right-48"></div>
        <div
          class="floating-circle-reverse bg-gray-200 dark:bg-dark-700 opacity-20 w-40 h-40 rounded-full absolute bottom-20 left-1/4"
        ></div>
      </div>

      <!-- 头部信息 -->
      <div class="text-center mb-8 relative z-10">
        <div class="inline-block animate-bounce mb-4">
          <div class="text-5xl">🖥️</div>
        </div>
        <h1 class="text-4xl font-bold mb-4">全屏演示页面</h1>
        <p class="text-xl opacity-90 max-w-2xl mx-auto">这是一个演示全屏功能的页面，当您从菜单点击进入时会自动进入全屏模式</p>

        <!-- 当前时间显示 -->
        <div class="mt-4 text-sm bg-gray-100 dark:bg-dark-800 inline-block px-4 py-2 rounded-full">
          {{ currentTime.toLocaleTimeString() }} - {{ currentTime.toLocaleDateString() }}
        </div>
      </div>

      <!-- 状态显示 -->
      <div class="bg-white dark:bg-dark-800 rounded-xl p-6 mb-8 shadow-lg">
        <h2 class="text-2xl font-semibold mb-4 flex items-center"><span class="mr-2">📊</span> 当前状态</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="bg-gray-50 dark:bg-dark-700 rounded-lg p-5 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-dark-600 hover:transform hover:scale-105"
            @click="triggerAnimation"
          >
            <div class="text-sm opacity-75">全屏状态</div>
            <div class="text-2xl font-bold flex items-center space-x-2 mt-1">
              <div class="w-3 h-3 rounded-full" :class="isFullscreen ? 'bg-green-500 animate-pulse' : 'bg-red-500'"></div>
              <span>{{ isFullscreen ? '已全屏' : '未全屏' }}</span>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-dark-700 rounded-lg p-5 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-dark-600">
            <div class="text-sm opacity-75">页面配置</div>
            <div class="text-lg mt-1">
              <code class="bg-gray-100 dark:bg-dark-800 px-3 py-1 rounded-md">isFull: true</code>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能说明 -->
      <div class="bg-white dark:bg-dark-800 rounded-xl p-6 mb-8 flex-1 shadow-lg">
        <h2 class="text-2xl font-semibold mb-6 flex items-center"><span class="mr-2">🚀</span> 功能说明</h2>
        <div class="space-y-6">
          <div class="flex items-start gap-4">
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white font-bold">1</div>
            <div class="flex-1">
              <h3 class="font-semibold text-xl">自动全屏</h3>
              <p class="opacity-90">当路由的 meta.isFull 设置为 true 时，从菜单点击进入会自动触发全屏</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white font-bold">2</div>
            <div class="flex-1">
              <h3 class="font-semibold text-xl">路由配置</h3>
              <p class="opacity-90">在页面的 definePage 中设置 meta.isFull: true</p>
              <div class="mt-2 bg-gray-100 dark:bg-dark-700 p-3 rounded-md">
                <pre class="text-sm text-left"><code>definePage({
  meta: {
    title: '全屏演示',
    isFull: true,
    icon: 'material-symbols:fullscreen',
  },
})</code></pre>
              </div>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white font-bold">3</div>
            <div class="flex-1">
              <h3 class="font-semibold text-xl">适用场景</h3>
              <p class="opacity-90">数据大屏、演示页面、图表展示等需要全屏显示的场景</p>
              <div class="grid grid-cols-3 gap-3 mt-3">
                <div class="bg-gray-100 dark:bg-dark-700 px-3 py-1 rounded-md text-center">数据大屏</div>
                <div class="bg-gray-100 dark:bg-dark-700 px-3 py-1 rounded-md text-center">演示页面</div>
                <div class="bg-gray-100 dark:bg-dark-700 px-3 py-1 rounded-md text-center">图表展示</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="text-center space-x-4 relative z-10">
        <NButton v-if="isFullscreen" type="warning" size="large" @click="handleExitFullscreen" class="fullscreen-btn exit-btn">
          <span class="mr-2">🚪</span> 退出全屏
        </NButton>
        <NButton v-else type="primary" size="large" @click="toggle" class="fullscreen-btn enter-btn">
          <span class="mr-2">🖥️</span> 进入全屏
        </NButton>
      </div>

      <!-- 提示信息 -->
      <div class="text-center mt-6 opacity-75 relative z-10">
        <p class="text-sm">
          💡 提示：您也可以按
          <kbd class="bg-gray-100 dark:bg-dark-800 px-2 py-1 rounded font-mono text-sm">F11</kbd> 或
          <kbd class="bg-gray-100 dark:bg-dark-800 px-2 py-1 rounded font-mono text-sm">Esc</kbd>
          来切换全屏状态
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.floating-circle {
  animation: float 8s infinite ease-in-out;
}

.floating-circle-slow {
  animation: float 12s infinite ease-in-out;
}

.floating-circle-reverse {
  animation: float-reverse 10s infinite ease-in-out;
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(20px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
}

@keyframes float-reverse {
  0% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(20px) translateX(-20px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
}
</style>
