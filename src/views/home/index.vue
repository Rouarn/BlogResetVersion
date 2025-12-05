<script setup lang="ts">
import { useRouter } from 'vue-router'
import pkg from '~/package.json'

const router = useRouter()

const features = [
  {
    icon: 'material-symbols:speed',
    title: '高性能',
    description: '基于 Vite 构建，开发体验极佳，构建速度超快',
    color: '#52c41a',
  },
  {
    icon: 'material-symbols:palette',
    title: '现代设计',
    description: '采用 Naive UI 组件库，界面简洁美观，支持暗黑模式',
    color: '#2080f0',
  },
  {
    icon: 'material-symbols:code',
    title: 'TypeScript',
    description: '完整的 TypeScript 支持，提供更好的开发体验',
    color: '#faad14',
  },
  {
    icon: 'material-symbols:responsive-layout',
    title: '响应式',
    description: '完美适配各种设备，移动端体验优秀',
    color: '#f5222d',
  },
]

const techStack = [
  { name: 'Vue 3', version: '3.5+', icon: 'logos:vue', description: '渐进式 JavaScript 框架' },
  { name: 'Vite', version: '7.x', icon: 'logos:vitejs', description: '下一代前端构建工具' },
  { name: 'TypeScript', version: '5.x', icon: 'logos:typescript-icon', description: '类型安全的 JavaScript' },
  { name: 'Naive UI', version: '2.x', icon: 'material-symbols:widgets', description: '现代化 Vue 3 组件库' },
  { name: 'UnoCSS', version: '0.x', icon: 'logos:unocss', description: '即时原子化 CSS 引擎' },
  { name: 'Pinia', version: '3.x', icon: 'logos:pinia', description: 'Vue 状态管理库' },
]

// 按钮功能函数
const handleGetStarted = () => {
  // 使用Vue Router跳转到关于页面
  router.push('/about')
}

const handleViewSource = () => {
  // 跳转到GitHub仓库（外部链接）
  window.open(pkg.homepage, '_blank')
}

const handleDownload = () => {
  // 跳转到GitHub releases页面（外部链接）
  window.open(`${pkg.homepage}/releases`, '_blank')
}

const handleViewDocs = () => {
  // 跳转到项目网站（外部链接）
  window.open(pkg.website, '_blank')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10"></div>
      <div class="relative px-6 py-24 mx-auto max-w-7xl sm:py-32 lg:px-8">
        <div class="text-center">
          <div class="flex justify-center mb-8">
            <div class="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg">
              <SvgIcon icon="material-symbols:rocket-launch" class="w-16 h-16 text-primary" />
            </div>
          </div>
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            <span class="text-primary">Frontend</span> Template
          </h1>
          <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {{ pkg.description }}
          </p>
          <div class="flex items-center justify-center mt-10 gap-x-6">
            <NButton type="primary" size="large" class="px-8 py-3" @click="handleGetStarted">
              <template #icon>
                <SvgIcon icon="material-symbols:play-arrow" />
              </template>
              开始使用
            </NButton>
            <NButton quaternary size="large" class="px-8 py-3" @click="handleViewSource">
              <template #icon>
                <SvgIcon icon="material-symbols:code" />
              </template>
              查看源码
            </NButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="px-6 py-24 mx-auto max-w-7xl lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">核心特性</h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">现代化的前端开发体验</p>
      </div>
      <div class="grid grid-cols-1 gap-8 mt-16 sm:grid-cols-2 lg:grid-cols-4">
        <NCard
          v-for="feature in features"
          :key="feature.title"
          class="card-wrapper hover:shadow-lg transition-shadow duration-300"
          :bordered="false"
        >
          <div class="text-center">
            <div class="flex justify-center mb-4">
              <div class="p-3 rounded-full" :style="{ backgroundColor: feature.color + '20' }">
                <SvgIcon :icon="feature.icon" class="w-8 h-8" :style="{ color: feature.color }" />
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ feature.title }}
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {{ feature.description }}
            </p>
          </div>
        </NCard>
      </div>
    </div>

    <!-- Tech Stack Section -->
    <div class="px-6 py-24 mx-auto max-w-7xl lg:px-8 bg-white/50 dark:bg-gray-800/50">
      <div class="text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">技术栈</h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">基于现代化的前端技术构建</p>
      </div>
      <div class="grid grid-cols-1 gap-6 mt-16 sm:grid-cols-2 lg:grid-cols-3">
        <NCard
          v-for="tech in techStack"
          :key="tech.name"
          class="card-wrapper hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          :bordered="false"
        >
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <SvgIcon :icon="tech.icon" class="w-12 h-12" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ tech.name }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ tech.version }}
              </p>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {{ tech.description }}
              </p>
            </div>
          </div>
        </NCard>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="px-6 py-24 mx-auto max-w-7xl lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">项目信息</h2>
      </div>
      <div class="grid grid-cols-1 gap-8 mt-16 sm:grid-cols-3">
        <div class="text-center">
          <div class="text-4xl font-bold text-primary">{{ pkg.version }}</div>
          <div class="mt-2 text-lg text-gray-600 dark:text-gray-300">当前版本</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-primary">{{ Object.keys(pkg.dependencies).length }}</div>
          <div class="mt-2 text-lg text-gray-600 dark:text-gray-300">生产依赖</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-primary">{{ pkg.license }}</div>
          <div class="mt-2 text-lg text-gray-600 dark:text-gray-300">开源协议</div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="px-6 py-24 mx-auto max-w-7xl lg:px-8">
      <div class="text-center bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl p-12">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">开始你的项目</h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          使用这个模板快速启动你的前端项目，享受现代化的开发体验
        </p>
        <div class="flex items-center justify-center mt-8 gap-x-6">
          <NButton type="primary" size="large" class="px-8 py-3" @click="handleDownload">
            <template #icon>
              <SvgIcon icon="material-symbols:download" />
            </template>
            立即下载
          </NButton>
          <NButton quaternary size="large" class="px-8 py-3" @click="handleViewDocs">
            <template #icon>
              <SvgIcon icon="material-symbols:description" />
            </template>
            查看文档
          </NButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg-gradient-to-br {
  background: linear-gradient(to bottom right, var(--uno-colors-blue-50), var(--uno-colors-indigo-100));
}

.dark .bg-gradient-to-br {
  background: linear-gradient(to bottom right, var(--uno-colors-gray-900), var(--uno-colors-gray-800));
}

.text-primary {
  color: var(--primary-color);
}
</style>
