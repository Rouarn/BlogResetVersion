<script setup lang="ts">
import { useRoute } from 'vue-router'
import SvgIcon from '@/components/custom/svg-icon.vue'
import { BLOG_NAV_ITEMS } from '@/constants/blog'
import { useRouterPush } from '@/hooks/common/router'

defineOptions({
  name: 'BlogBottomNav',
})

const { routerPushByKey } = useRouterPush()
const route = useRoute()

const navItems = BLOG_NAV_ITEMS

const isActive = (path: string) => route.path.startsWith(path)
</script>

<template>
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 flex justify-around items-center z-50 pb-safe"
  >
    <div
      v-for="item in navItems"
      :key="item.key"
      class="flex flex-col items-center cursor-pointer transition-colors"
      :class="isActive(item.path) ? 'text-indigo-600' : 'text-slate-400'"
      @click="routerPushByKey(item.key as any)"
    >
      <SvgIcon :icon="item.icon" class="text-2xl mb-1" />
      <span class="text-[10px] font-medium">{{ item.label }}</span>
    </div>
  </nav>
</template>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
