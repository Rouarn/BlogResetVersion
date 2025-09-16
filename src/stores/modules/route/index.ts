import { fetchGetUserRoutes } from '@/service/api'
import { generateMenus, getCacheRouteNames, transformMenuToSearchMenus, updateMenuLocale } from './shared'
import { SetupStoreId } from '@/enum'
import useBoolean from '@/hooks/common/use-boolean'
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const { bool: isInitConstantRoute, setBool: setIsInitConstantRoute } = useBoolean()

  /** route mode */
  const authRouteMode = ref(import.meta.env.VITE_AUTH_ROUTE_MODE)

  /** Global menus */
  const menus = ref<App.Global.Menu[]>([])
  const searchMenus = computed(() => transformMenuToSearchMenus(menus.value))

  /**
   * Get global menus
   *
   * @param routes Vue routes
   */
  function getGlobalMenus(routes: RouteRecordRaw[]) {
    menus.value = generateMenus(routes)
  }

  /** Update global menus by locale */
  function updateGlobalMenusByLocale() {
    menus.value = updateMenuLocale(menus.value)
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

  /** 初始化应用路由 */
  async function initRoute(routes: RouteRecordRaw[]) {
    // 如果已经初始化则直接返回
    if (isInitConstantRoute.value) return

    try {
      let routesToUse: RouteRecordRaw[] = routes

      // 如果是动态模式则获取动态路由
      if (authRouteMode.value === 'dynamic') {
        const { data, error } = await fetchGetUserRoutes()

        if (!error && data?.routes) {
          routesToUse = data.routes
        } else {
          // 出错时回退到静态路由
          console.warn('获取动态路由失败，使用静态路由回退:', error)
        }
      }

      // 处理选定的路由
      getGlobalMenus(routesToUse)
      getCacheRoutes(routesToUse)

      // 标记初始化完成
      setIsInitConstantRoute(true)
    } catch (error) {
      // 处理初始化过程中的意外错误
      console.error('路由初始化失败:', error)
      // 可选择重新抛出或优雅处理
      if (error instanceof Error) {
        throw new Error(`路由初始化失败: ${error.message}`)
      } else {
        throw new Error('路由初始化因未知错误而失败')
      }
    }
  }

  return {
    menus,
    searchMenus,
    cacheRoutes,
    isInitConstantRoute,
    initRoute,
    getGlobalMenus,
    updateGlobalMenusByLocale,
  }
})
