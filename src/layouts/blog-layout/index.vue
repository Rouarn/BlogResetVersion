<script setup lang="ts">
import GlobalFooter from '@/layouts/modules/global-footer/index.vue'
import BlogBottomNav from '@/views/home/modules/BlogBottomNav.vue'
import BlogNavbar from '@/views/home/modules/BlogNavbar.vue'
import { useAppStore } from '@/stores/modules/app'

defineOptions({
  name: 'BlogLayout',
})

const appStore = useAppStore()
const isMobile = computed(() => appStore.isMobile)

const isTop = ref(true)
const handleBackTop = (_isTop: boolean) => {
  isTop.value = _isTop
}
</script>

<template>
  <div class="bg-slate-50 text-slate-900 leading-relaxed font-inter min-h-screen pb-20 md:pb-0">
    <BlogNavbar />
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in" appear>
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>
    <GlobalFooter />
    <NBackTop :right="isMobile ? 20 : ''" :bottom="isMobile ? 85 : ''" class="z-3" @update:show="handleBackTop" />
    <BlogBottomNav />
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

.font-inter {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
