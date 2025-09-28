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

  /** 路由模式 */
  const authRouteMode = ref(import.meta.env.VITE_AUTH_ROUTE_MODE)

  /** 全局菜单 */
  const menus = ref<App.Global.Menu[]>([])
  const searchMenus = computed(() => transformMenuToSearchMenus(menus.value))

  /**
   * 获取全局菜单
   *
   * @param routes Vue 路由
   */
  function getGlobalMenus(routes: AutoRouterRoute[]) {
    menus.value = getAuthElegantRoutes(routes)
  }

  /** 根据语言更新全局菜单 */
  function updateGlobalMenusByLocale() {
    menus.value = updateMenuLocale(menus.value)
  }

  /** 缓存路由 */
  const cacheRoutes = ref<App.Global.RouteKey[]>([])

  /**
   * 获取缓存路由
   *
   * @param routes Vue 路由
   */
  function getCacheRoutes(routes: AutoRouterRoute[]) {
    cacheRoutes.value = getCacheRouteNames(routes)
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

  /**
   * 将路由添加到 Vue Router
   *
   * @param routes Vue 路由
   */
  function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
    routes.forEach((route) => {
      const removeFn = router.addRoute(route)
      addRemoveRouteFn(removeFn)
    })
  }

  /** 鉴权路由 */
  const authRoutes = shallowRef<AutoRouterRoute[]>([])

  function addAuthRoutes(routes: AutoRouterRoute[]) {
    const authRoutesMap = new Map<string, AutoRouterRoute>([])

    routes.forEach((route) => {
      authRoutesMap.set(route.name, route)
    })

    authRoutes.value = Array.from(authRoutesMap.values())
  }

  /** 处理常量路由与鉴权路由 */
  function handleConstantAndAuthRoutes() {
    const allRoutes = [...authRoutes.value]

    const vueRoutes = getAuthVueRoutes(allRoutes)

    resetVueRoutes()

    addRoutesToVueRouter(vueRoutes)

    getGlobalMenus(allRoutes)

    getCacheRoutes(allRoutes)
  }

  /** 初始化动态鉴权路由 */
  async function initDynamicAuthRoute() {
    const { data, error } = await fetchGetUserRoutes()

    if (!error) {
      const { routes } = data

      addAuthRoutes(routes)

      handleConstantAndAuthRoutes()

      setIsInitAuthRoute(true)
    } else {
      // 如果获取用户路由失败，重置存储
      authStore.resetStore()
    }
  }

  /** 初始化静态鉴权路由 */
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
    updateGlobalMenusByLocale,
  }
})
