<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import { useRouteStore } from '@/stores/modules/route'

defineOptions({
  name: 'GlobalContent',
})

interface Props {
  /** Show padding for content */
  showPadding?: boolean
}

withDefaults(defineProps<Props>(), {
  showPadding: true,
})

const appStore = useAppStore()
const routeStore = useRouteStore()
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="fade" mode="out-in">
      <KeepAlive :include="routeStore.cacheRoutes">
        <component
          :is="Component"
          v-if="appStore.reloadFlag"
          :key="route.fullPath"
          :class="{ 'p-16px': showPadding }"
          class="flex-grow bg-layout transition-300"
        />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<style></style>
