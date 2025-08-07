<script setup lang="ts">
import GlobalContent from '../modules/global-content/index.vue'
import GlobalFooter from '../modules/global-footer/index.vue'
import GlobalHeader from '../modules/global-header/index.vue'
import ThemeDrawer from '../modules/theme-drawer/index.vue'
import { useAppStore } from '@/stores/modules/app'

defineOptions({
  name: 'BaseLayout',
})

const appStore = useAppStore()

const isTop = ref(true)
const handleBackTop = (_isTop: boolean) => {
  isTop.value = _isTop
}
</script>

<template>
  <div class="min-h-full">
    <GlobalHeader v-if="!appStore.hideHeader" />
    <GlobalContent />
    <GlobalFooter />
    <ThemeDrawer />
    <NBackTop :right="100" class="z-3" @update:show="handleBackTop" />
  </div>
</template>

<style scoped></style>
