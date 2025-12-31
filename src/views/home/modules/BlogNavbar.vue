<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BlogSearchModal from './BlogSearchModal.vue'
import SvgIcon from '@/components/custom/svg-icon.vue'
import { useAuthStore } from '@/stores/modules/auth'
import { BLOG_NAV_ITEMS } from '@/constants/blog'
import { useRouterPush } from '@/hooks/common/router'

defineOptions({
  name: 'BlogNavbar',
})

const { routerPushByKey } = useRouterPush()
const route = useRoute()
const authStore = useAuthStore()

const showSearch = ref(false)

const navItems = BLOG_NAV_ITEMS

const isActive = (path: string) => {
  if (path === '/home') {
    return route.path === '/home' || route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
    <div class="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center space-x-2 cursor-pointer" @click="routerPushByKey('home')">
        <SvgIcon icon="ph:feather-duotone" class="text-3xl text-indigo-600" />
        <span class="text-xl font-semibold tracking-tight">FocusLog</span>
      </div>
      <div class="hidden md:flex items-center space-x-10 text-sm font-medium text-slate-500">
        <div
          v-for="item in navItems"
          :key="item.key"
          class="transition-colors cursor-pointer"
          :class="isActive(item.path) ? 'text-slate-900 font-semibold' : 'hover:text-indigo-600'"
          @click="routerPushByKey(item.key as any)"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <ButtonIcon
          v-if="authStore.isLogin"
          icon="ph:pencil-simple-line-bold"
          class="text-xl"
          tooltip-content="写文章"
          @click="routerPushByKey('article-edit')"
        />
        <ButtonIcon icon="ph:magnifying-glass-bold" class="text-xl" tooltip-content="搜索" @click="showSearch = true" />
      </div>
    </div>
    <BlogSearchModal v-model:show="showSearch" />
  </nav>
</template>
