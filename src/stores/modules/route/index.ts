import { getCacheRouteNames, getGlobalMenusByRoutes, transformMenuToSearchMenus } from './shared'
import { SetupStoreId } from '@/enum'
import useBoolean from '@/hooks/common/use-boolean'
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const { bool: isInitConstantRoute, setBool: setIsInitConstantRoute } = useBoolean()

  /** Global menus */
  const menus = ref<App.Global.Menu[]>([])
  const searchMenus = computed(() => transformMenuToSearchMenus(menus.value))

  /** Get global menus */
  function getGlobalMenus(routes: RouteRecordRaw[]) {
    menus.value = getGlobalMenusByRoutes(routes)
  }

  /** Cache routes */
  const cacheRoutes = ref<App.Global.RouteKey[]>([])

  /**
   * Get cache routes
   *
   * @param routes Vue routes
   */
  function getCacheRoutes(routes: RouteRecordRaw[]) {
    cacheRoutes.value = getCacheRouteNames(routes)
  }

  /** Initialize route */
  async function initRoute(routes: RouteRecordRaw[]) {
    if (isInitConstantRoute.value) return

    getGlobalMenus(routes)

    getCacheRoutes(routes)

    setIsInitConstantRoute(true)
  }

  return {
    menus,
    searchMenus,
    cacheRoutes,
    isInitConstantRoute,
    initRoute,
    getGlobalMenus,
  }
})
