<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import { useRouteStore } from '@/stores/modules/route'
import { useThemeStore } from '@/stores/modules/theme'
import { useRouterPush } from '@/hooks/router'

const route = useRoute()
const appStore = useAppStore()
const routeStore = useRouteStore()
const themeStore = useThemeStore()
const { routerPushByKeyWithMetaQuery } = useRouterPush()

const isMobile = computed(() => appStore.isMobile)
const selectedKey = computed(() => {
  const { hideInMenu, activeMenu } = route.meta
  const name = route.name as string
  return (hideInMenu ? activeMenu : name) || name
})

const inverted = computed(() => themeStore.themeScheme === 'dark')
</script>

<template>
  <NMenu
    v-if="!isMobile"
    :value="selectedKey"
    mode="horizontal"
    :options="routeStore.menus"
    :indent="18"
    :inverted="inverted"
    responsive
    @update:value="routerPushByKeyWithMetaQuery"
    class="flex-1 mx-6"
  />
</template>
