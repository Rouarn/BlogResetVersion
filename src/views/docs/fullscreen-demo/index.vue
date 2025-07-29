<script setup lang="ts">
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

function handleExitFullscreen() {
  if (isFullscreen.value) {
    exit()
  }
}
</script>

<template>
  <div class="fullscreen-demo h-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
    <div class="container mx-auto px-4 py-8 h-full flex flex-col">
      <!-- 头部信息 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-4">🖥️ 全屏演示页面</h1>
        <p class="text-xl opacity-90">这是一个演示全屏功能的页面，当您从菜单点击进入时会自动进入全屏模式</p>
      </div>

      <!-- 状态显示 -->
      <div class="bg-white bg-opacity-20 rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">📊 当前状态</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white bg-opacity-10 rounded p-4">
            <div class="text-sm opacity-75">全屏状态</div>
            <div class="text-2xl font-bold">
              {{ isFullscreen ? '✅ 已全屏' : '❌ 未全屏' }}
            </div>
          </div>
          <div class="bg-white bg-opacity-10 rounded p-4">
            <div class="text-sm opacity-75">页面配置</div>
            <div class="text-lg">
              <code class="bg-black bg-opacity-30 px-2 py-1 rounded">isFull: true</code>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能说明 -->
      <div class="bg-white bg-opacity-20 rounded-lg p-6 mb-8 flex-1">
        <h2 class="text-2xl font-semibold mb-4">🚀 功能说明</h2>
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <span class="text-2xl">1️⃣</span>
            <div>
              <h3 class="font-semibold">自动全屏</h3>
              <p class="opacity-90">当路由的 meta.isFull 设置为 true 时，从菜单点击进入会自动触发全屏</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <span class="text-2xl">2️⃣</span>
            <div>
              <h3 class="font-semibold">路由配置</h3>
              <p class="opacity-90">在页面的 definePage 中设置 meta.isFull: true</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <span class="text-2xl">3️⃣</span>
            <div>
              <h3 class="font-semibold">适用场景</h3>
              <p class="opacity-90">数据大屏、演示页面、图表展示等需要全屏显示的场景</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="text-center space-x-4">
        <NButton
          v-if="isFullscreen"
          type="warning"
          size="large"
          @click="handleExitFullscreen"
          class="bg-white bg-opacity-20 border-white text-white hover:bg-opacity-30"
        >
          🚪 退出全屏
        </NButton>
        <NButton
          v-else
          type="primary"
          size="large"
          @click="toggle"
          class="bg-white bg-opacity-20 border-white text-white hover:bg-opacity-30"
        >
          🖥️ 进入全屏
        </NButton>
      </div>

      <!-- 提示信息 -->
      <div class="text-center mt-6 opacity-75">
        <p class="text-sm">
          💡 提示：您也可以按 <kbd class="bg-black bg-opacity-30 px-2 py-1 rounded">F11</kbd> 或
          <kbd class="bg-black bg-opacity-30 px-2 py-1 rounded">Esc</kbd> 来切换全屏状态
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fullscreen-demo {
  min-height: 100vh;
}

kbd {
  font-family: monospace;
  font-size: 0.875rem;
}
</style>
