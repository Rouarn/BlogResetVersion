<script setup lang="ts">
import ConfigOperation from './modules/config-operation.vue'
import DarkMode from './modules/dark-mode.vue'
import ThemeColor from './modules/theme-color.vue'
import WatermarkSettings from './modules/watermark-settings.vue'
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
      <WatermarkSettings />
      <template #footer>
        <ConfigOperation />
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
