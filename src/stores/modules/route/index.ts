import { routes as elegantRoutes } from '@/router/_generated/routes'
import { fetchGetUserRoutes } from '@/service/api'
import {
  getAuthElegantRoutes,
  getCacheRouteNames,
  getCacheRouteNamesByElegantRoutes,
  getGlobalMenusByAuthRoutes,
  getGlobalMenusByElegantRoutes,
} from './shared'
import { SetupStoreId } from '@/enum'
import useBoolean from '@/hooks/common/use-boolean'
import type { AutoRouterRoute } from '@elegant-router/types'
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const { bool: isInitConstantRoute, setBool: setIsInitConstantRoute } = useBoolean()

  /** route mode */
  const _authRouteMode = ref(import.meta.env.VITE_AUTH_ROUTE_MODE)

  /** Global menus */
  const menus = ref<App.Global.Menu[]>([])

  // elegant-router相关状态
  const elegantRoutesData = ref<AutoRouterRoute[]>(elegantRoutes)
  const authElegantRoutes = ref<AutoRouterRoute[]>([])

  /** Cache routes */
  const cacheRoutes = ref<App.Global.RouteKey[]>([])

  /**
   * Handle auth route for elegant router
   *
   * @param routes Auth elegant routes
   */
  function handleAuthRoute(routes: AutoRouterRoute[]) {
    menus.value = getGlobalMenusByElegantRoutes(routes)
    cacheRoutes.value = getCacheRouteNamesByElegantRoutes(routes)
  }

  /**
   * Handle auth route for vue router (legacy)
   *
   * @param routes Auth routes
   */
  function handleAuthRouteForVueRouter(routes: RouteRecordRaw[]) {
    menus.value = getGlobalMenusByAuthRoutes(routes)
    cacheRoutes.value = getCacheRouteNames(routes)
  }

  /**
   * Initialize static auth route
   */
  async function initStaticRoute() {
    // 使用elegant-router生成的路由
    const routes = getAuthElegantRoutes(elegantRoutesData.value, [])
    authElegantRoutes.value = routes

    handleAuthRoute(routes)
  }

  /**
   * Initialize dynamic auth route
   */
  async function initDynamicRoute() {
    const { data } = await fetchGetUserRoutes()

    if (data) {
      // 如果是动态路由，仍然使用传统方式
      handleAuthRouteForVueRouter(data)
    }
  }

  /**
   * Initialize auth route
   */
  async function initAuthRoute() {
    if (isInitConstantRoute.value) return

    setIsInitConstantRoute(true)

    if (_authRouteMode.value === 'dynamic') {
      await initDynamicRoute()
    } else {
      await initStaticRoute()
    }
  }

  return {
    menus,
    cacheRoutes,
    elegantRoutesData,
    authElegantRoutes,
    initAuthRoute,
    handleAuthRoute,
    handleAuthRouteForVueRouter,
  }
})
