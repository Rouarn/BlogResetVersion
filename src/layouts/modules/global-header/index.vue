<script setup lang="ts">
import GlobalLogo from '../global-logo/index.vue'
import GlobalMenu from '../global-menu/index.vue'
import GlobalSearch from '../global-search/index.vue'
import ThemeButton from './components/theme-button.vue'
import UserAvatar from './components/user-avatar.vue'
import ThemeSchemaSwitch from '@/components/common/theme-schema-switch.vue'
import { useAppStore } from '@/stores/modules/app'
import { useThemeStore } from '@/stores/modules/theme'
import { useFullscreen } from '@vueuse/core'

defineOptions({
  name: 'GlobalHeader',
})

const appStore = useAppStore()
const themeStore = useThemeStore()
const { isFullscreen, toggle } = useFullscreen()
</script>

<template>
  <DarkModeContainer class="px-12px shadow-header sticky top-0 z-50">
    <header class="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
      <!-- 左侧：Logo和系统名称 -->
      <GlobalLogo class="h-full" v-if="!appStore.isMobile" />

      <!-- 中间：导航菜单 -->
      <GlobalMenu />

      <!-- 右侧：操作区 -->
      <div class="flex items-center space-x-2">
        <!-- 搜索按钮 -->
        <GlobalSearch />
        <!-- 全屏切换 -->
        <FullScreen v-if="!appStore.isMobile" :full="isFullscreen" @click="toggle" />
        <!-- 语言切换 -->
        <LangSwitch :lang="appStore.locale" :lang-options="appStore.localeOptions" @change-lang="appStore.changeLocale" />
        <!-- 主题切换 -->
        <ThemeSchemaSwitch :theme-schema="themeStore.themeScheme" :is-dark="themeStore.darkMode" @switch="themeStore.toggleThemeScheme" />
        <!-- 主题配置按钮 -->
        <ThemeButton />
        <!-- 用户头像 -->
        <UserAvatar />
      </div>
    </header>
  </DarkModeContainer>
</template>

<style lang="scss" scoped></style>
