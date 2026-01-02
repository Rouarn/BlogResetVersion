<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRouteStore } from '@/stores/modules/route'
import { useThemeStore } from '@/stores/modules/theme'
import { useRouterPush } from '@/hooks/common/router'

defineOptions({
  name: 'BlogBottomNav',
})

const route = useRoute()
const routeStore = useRouteStore()
const themeStore = useThemeStore()
const { routerPushByKeyWithMetaQuery } = useRouterPush()

const activeKey = computed(() => {
  const { hideInMenu, activeMenu } = route.meta
  const name = route.name as string
  return (hideInMenu ? activeMenu : name) || name
})

function handleSelect(key: string) {
  routerPushByKeyWithMetaQuery(key)
}
</script>

<template>
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#18181c] border-t border-slate-100 dark:border-slate-800 flex justify-around items-center z-50 pb-safe"
  >
    <div
      v-for="item in routeStore.menus"
      :key="item.key"
      class="flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-colors duration-200"
      :class="[activeKey === item.key ? '' : 'text-slate-500 dark:text-slate-400']"
      :style="{ color: activeKey === item.key ? themeStore.themeColor : '' }"
      @click="handleSelect(item.key)"
    >
      <component :is="item.icon" class="text-xl mb-1" />
      <span class="text-[10px] leading-none">{{ item.label }}</span>
    </div>
  </nav>
</template>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
