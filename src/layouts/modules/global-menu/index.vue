<script lang="ts" setup>
import { useRoute } from 'vue-router'
import GlobalLogo from '@/layouts/modules/global-logo/index.vue'
import { useAppStore } from '@/stores/modules/app'
import { useRouteStore } from '@/stores/modules/route'
import { useRouterPush } from '@/hooks/common/router'

const route = useRoute()
const appStore = useAppStore()
const routeStore = useRouteStore()
const { routerPushByKeyWithMetaQuery } = useRouterPush()

const isMobile = computed(() => appStore.isMobile)
const selectedKey = computed(() => {
  const { hideInMenu, activeMenu } = route.meta
  const name = route.name as string
  return (hideInMenu ? activeMenu : name) || name
})

const isVisible = ref(false)
</script>

<template>
  <NMenu
    v-if="!isMobile"
    :value="selectedKey"
    mode="horizontal"
    :options="routeStore.menus"
    responsive
    @update:value="routerPushByKeyWithMetaQuery"
    class="flex-1 mx-6"
  />

  <NIcon v-if="isMobile" size="20" @click="isVisible = !isVisible">
    <icon-line-md:menu-fold-right v-if="!isVisible" />
    <icon-line-md:menu-fold-left v-else />
  </NIcon>
  <NDrawer v-model:show="isVisible" width="80%" placement="left" v-if="isMobile">
    <NDrawerContent body-content-class="pa-0!">
      <template #header>
        <GlobalLogo />
      </template>
      <NMenu v-model:value="selectedKey" mode="vertical" :options="routeStore.menus" @update:value="routerPushByKeyWithMetaQuery" />
    </NDrawerContent>
  </NDrawer>
</template>
