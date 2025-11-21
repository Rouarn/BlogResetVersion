import router from '@/router'
import { fetchGetUserRoutes } from '@/service/api'
import {
  getCacheRouteNames,
  getFlatMenuList,
  getGlobalMenuByBaseRoute,
  resolveRouteComponent,
  transformMenuToSearchMenus,
  updateLocaleOfGlobalMenus,
} from './shared'
import { SetupStoreId } from '@/enum'
import useBoolean from '@/hooks/common/use-boolean'
import { defineStore } from 'pinia'
import type { RouteComponent, RouteRecordRaw } from 'vue-router'

export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const { bool: isInitAuthRoute, setBool: setIsInitAuthRoute } = useBoolean()

  /** 全局菜单 */
  const menus = ref<App.Global.Menu[]>([])
  const searchMenus = computed(() => transformMenuToSearchMenus(menus.value))

  /**
   * 获取全局菜单
   *
   * @param routes Vue 路由
   */
  function getGlobalMenus(routes: RouteRecordRaw[]) {
    menus.value = getGlobalMenuByBaseRoute(routes)
  }

  /** 根据语言更新全局菜单 */
  function updateGlobalMenusByLocale() {
    menus.value = updateLocaleOfGlobalMenus(menus.value)
    console.log('menus.value: ', menus.value)
  }

  /**
   * Exclude cache routes
   *
   * for reset route cache
   */
  const excludeCacheRoutes = ref<App.Global.RouteKey[]>([])

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

  /**
   * Reset route cache
   *
   * @default router.currentRoute.value.name current route name
   * @param routeKey 路由名称
   */
  async function resetRouteCache(routeKey?: App.Global.RouteKey) {
    const routeName = routeKey || (router.currentRoute.value.name as App.Global.RouteKey)

    excludeCacheRoutes.value.push(routeName)

    await nextTick()

    excludeCacheRoutes.value = []
  }

  const removeRouteFns: (() => void)[] = []

  /** 重置 Vue 路由 */
  function resetVueRoutes() {
    removeRouteFns.forEach((fn) => fn())
    removeRouteFns.length = 0
  }

  /**
   * 添加移除路由的方法
   *
   * @param fn
   */
  function addRemoveRouteFn(fn: () => void) {
    removeRouteFns.push(fn)
  }

  /** Reset store */
  async function resetStore() {
    const routeStore = useRouteStore()

    routeStore.$reset()

    resetVueRoutes()
  }

  /**
   * 将路由添加到 Vue Router
   *
   * @param routes Vue 路由
   */
  function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
    // 引入 views 文件夹下所有 vue 文件
    const modules = import.meta.glob('@/views/**/*.vue') as Record<string, () => Promise<RouteComponent>>

    routes.forEach((route: RouteRecordRaw) => {
      let removeFn: () => void
      const resolvedRoute = resolveRouteComponent(route as RouteRecordRaw, modules)
      if (resolvedRoute.meta?.isFull) {
        removeFn = router.addRoute(resolvedRoute as unknown as RouteRecordRaw)
      } else {
        removeFn = router.addRoute('Root', resolvedRoute as unknown as RouteRecordRaw)
      }
      addRemoveRouteFn(removeFn)
    })
  }

  /** create builtin vue routes */
  async function createBuiltinVueRoutes(): Promise<RouteRecordRaw[]> {
    const { data } = await fetchGetUserRoutes()
    const routes = [...data] as unknown as RouteRecordRaw[]
    return routes
  }

  /** 初始化应用路由 */
  async function initAuthRoute() {
    // 如果已经初始化则直接返回
    if (isInitAuthRoute.value) return

    const routes = await createBuiltinVueRoutes()

    // 转换为单层
    const flatRoutes = getFlatMenuList(routes)

    // 添加路由到 Vue Router
    addRoutesToVueRouter(flatRoutes)

    // 获取全局菜单（保留分组层级）
    getGlobalMenus(routes)

    setIsInitAuthRoute(true)
  }

  return {
    resetStore,
    menus,
    searchMenus,
    isInitAuthRoute,
    excludeCacheRoutes,
    cacheRoutes,
    initAuthRoute,
    getCacheRoutes,
    resetRouteCache,
    updateGlobalMenusByLocale,
  }
})
