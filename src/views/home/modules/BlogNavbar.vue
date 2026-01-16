<script setup lang="ts">
import { ref } from 'vue'
import BlogSearchModal from './BlogSearchModal.vue'
import SvgIcon from '@/components/custom/svg-icon.vue'
import GlobalMenu from '@/layouts/modules/global-menu/index.vue'
import { useAuthStore } from '@/stores/modules/auth'
import { useRouterPush } from '@/hooks/common/router'

defineOptions({
  name: 'BlogNavbar',
})

const { routerPushByKey } = useRouterPush()
const authStore = useAuthStore()

const showSearch = ref(false)
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
    <div class="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center space-x-2 cursor-pointer" @click="routerPushByKey('home')">
        <SvgIcon icon="ph:feather-duotone" class="text-3xl text-indigo-600" />
        <span class="text-xl font-semibold tracking-tight">一袖南烟顾</span>
      </div>
      <div class="hidden md:flex items-center space-x-10 text-sm font-medium text-slate-500">
        <GlobalMenu />
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
