<script setup lang="ts">
import DarkMode from './modules/dark-mode.vue'
import ThemeColor from './modules/theme-color.vue'
import { useAppStore } from '@/stores/modules/app'
import { $t } from '@/locales'

defineOptions({
  name: 'ThemeDrawer',
})

const appStore = useAppStore()
</script>

<template>
  <NDrawer v-model:show="appStore.themeDrawerVisible" display-directive="show" :width="360">
    <NDrawerContent :title="$t('theme.themeDrawerTitle')" :native-scrollbar="false" closable>
      <DarkMode />
      <ThemeColor />
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
