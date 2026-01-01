import { useAuthStore } from '@/stores/modules/auth'
import { useRouteStore } from '@/stores/modules/route'
import { RouteNameEnum } from '@/enum'
import type { RouteLocationRaw, Router } from 'vue-router'

/** 创建路由守卫（鉴权、菜单初始化、登录页拦截） */
export function createRouteGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const routeStore = useRouteStore()

    // 初始化路由菜单（用于 Header 菜单展示，实际路由基于文件自动生成）
    if (
      router.currentRoute.value.path.toLocaleLowerCase() !== `/${RouteNameEnum.LOGIN}` &&
      authStore.isLogin &&
      !routeStore.isInitAuthRoute
    ) {
      await routeStore.initAuthRoute()

      const notFoundRoute: App.Global.RouteKey[] = ['not-found', '404']
      const isNotFoundRoute = notFoundRoute.includes(to.name as App.Global.RouteKey)

      // 获取用户信息
      const success = await authStore.getUserInfo()
      if (!success) {
        // 显式清除 Token，防止 resetAuthStore 异常导致状态未清除
        authStore.setToken('')
        authStore.resetAuthStore()

        return next({ path: `/${RouteNameEnum.LOGIN}`, replace: false, query: { redirect: to.fullPath } })
      }

      // 由于鉴权路由尚未初始化，该路由被“not-found”捕获
      // 鉴权路由初始化后，重定向回原目标路由
      if (isNotFoundRoute) {
        const rootRoute: App.Global.RouteKey = RouteNameEnum.ROOT
        const path = to.redirectedFrom?.name === rootRoute ? '/' : to.fullPath

        const location: RouteLocationRaw = {
          path,
          replace: true,
          query: to.query,
          hash: to.hash,
        }

        return next(location)
      }
    }

    // 需要授权的页面
    if (to.meta.isAuth) {
      // 未登录则跳转登录
      if (!authStore.isLogin) {
        return next({ path: RouteNameEnum.LOGIN, replace: false, query: { redirect: to.fullPath } })
      }
    }

    // 访问登录页：已登录则留在原页，未登录允许访问
    if (to.path.toLocaleLowerCase() === `/${RouteNameEnum.LOGIN}`) {
      if (authStore.isLogin) return next(from.fullPath)
      return next()
    }

    // 正常访问页面
    next()
  })

  router.afterEach((to) => {
    // 可在此添加埋点或统计
    console.log('[router.afterEach]: ', to)
  })

  router.onError((error) => {
    // 统一路由错误处理入口（可结合上报系统）
    console.log('[router.onError]: ', error)
  })
}
