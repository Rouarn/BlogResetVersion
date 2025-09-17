import { createStaticRoutes, getAuthVueRoutes } from '@/router/routes'
import router from '@/router'
import { fetchGetUserRoutes } from '@/service/api'
import { useAuthStore } from '@/stores/modules/auth'
import { getAuthElegantRoutes, getCacheRouteNames, transformMenuToSearchMenus, updateMenuLocale } from './shared'
import { SetupStoreId } from '@/enum'
import useBoolean from '@/hooks/common/use-boolean'
import type { AutoRouterRoute } from '@elegant-router/types'
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const authStore = useAuthStore()
  const { bool: isInitAuthRoute, setBool: setIsInitAuthRoute } = useBoolean()

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
  function getGlobalMenus(routes: AutoRouterRoute[]) {
    menus.value = getAuthElegantRoutes(routes)
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
  function getCacheRoutes(routes: AutoRouterRoute[]) {
    cacheRoutes.value = getCacheRouteNames(routes)
  }

  const removeRouteFns: (() => void)[] = []

  /** Reset vue routes */
  function resetVueRoutes() {
    removeRouteFns.forEach((fn) => fn())
    removeRouteFns.length = 0
  }

  /**
   * Add remove route fn
   *
   * @param fn
   */
  function addRemoveRouteFn(fn: () => void) {
    removeRouteFns.push(fn)
  }

  /**
   * Add routes to vue router
   *
   * @param routes Vue routes
   */
  function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
    routes.forEach((route) => {
      const removeFn = router.addRoute(route)
      addRemoveRouteFn(removeFn)
    })
  }

  /** auth routes */
  const authRoutes = shallowRef<AutoRouterRoute[]>([])

  function addAuthRoutes(routes: AutoRouterRoute[]) {
    const authRoutesMap = new Map<string, AutoRouterRoute>([])

    routes.forEach((route) => {
      authRoutesMap.set(route.name, route)
    })

    authRoutes.value = Array.from(authRoutesMap.values())
    console.log('authRoutes.value: ', authRoutes.value)
  }

  /** handle constant and auth routes */
  function handleConstantAndAuthRoutes() {
    const allRoutes = [...authRoutes.value]

    const vueRoutes = getAuthVueRoutes(allRoutes)

    resetVueRoutes()

    addRoutesToVueRouter(vueRoutes)

    getGlobalMenus(allRoutes)

    getCacheRoutes(allRoutes)
  }

  /** Init dynamic auth route */
  async function initDynamicAuthRoute() {
    const { data, error } = await fetchGetUserRoutes()

    if (!error) {
      const { routes } = data

      addAuthRoutes(routes)

      handleConstantAndAuthRoutes()

      setIsInitAuthRoute(true)
    } else {
      // if fetch user routes failed, reset store
      authStore.resetStore()
    }
  }

  /** Init static auth route */
  function initStaticAuthRoute() {
    const { routes: staticAuthRoutes } = createStaticRoutes()

    addAuthRoutes(staticAuthRoutes)

    handleConstantAndAuthRoutes()

    setIsInitAuthRoute(true)
  }

  /** 初始化应用路由 */
  async function initAuthRoute() {
    // 如果已经初始化则直接返回
    if (isInitAuthRoute.value) return

    try {
      // 如果是动态模式则获取动态路由
      if (authRouteMode.value === 'static') {
        initStaticAuthRoute()
      } else {
        await initDynamicAuthRoute()
      }
    } catch (error) {
      // 处理初始化过程中的意外错误
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
    isInitAuthRoute,
    initAuthRoute,
    getGlobalMenus,
    updateGlobalMenusByLocale,
  }
})
