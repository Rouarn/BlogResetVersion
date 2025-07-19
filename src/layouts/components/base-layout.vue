<script setup lang="ts">
import GlobalContent from '../modules/global-content/index.vue'
import GlobalFooter from '../modules/global-footer/index.vue'
import GlobalHeader from '../modules/global-header/index.vue'
import ThemeDrawer from '../modules/theme-drawer/index.vue'

defineOptions({
  name: 'BaseLayout',
})

const top = ref(true)
const handleBackTop = (_isTop: boolean) => {
  top.value = _isTop
}
</script>

<template>
  <div>
    <GlobalHeader />
    <GlobalContent />
    <GlobalFooter />
    <ThemeDrawer />
    <NBackTop :right="100" class="z-3" @update:show="handleBackTop" />
  </div>
</template>

<style scoped></style>
