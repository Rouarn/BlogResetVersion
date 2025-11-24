import { useAuthStore } from '@/stores/modules/auth'
import { useRouteStore } from '@/stores/modules/route'
import type { RouteLocationRaw, Router } from 'vue-router'

/** 创建路由守卫（鉴权、菜单初始化、登录页拦截） */
export function createRouteGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const routeStore = useRouteStore()

    // 初始化路由菜单（用于 Header 菜单展示，实际路由基于文件自动生成）
    if (authStore.isLogin && !routeStore.isInitAuthRoute) {
      await routeStore.initAuthRoute()

      // 若因未初始化被 not-found 捕获，初始化后重定向至原目标
      const path = to.fullPath
      const location: RouteLocationRaw = {
        path,
        replace: true,
        query: to.query,
        hash: to.hash,
      }

      return next(location)
    }

    // 需要授权的页面
    if (to.meta.isAuth) {
      // 未登录则跳转登录
      if (!authStore.isLogin) {
        return next({ path: '/login', replace: false, query: { redirect: to.fullPath } })
      }
    }

    // 访问登录页：已登录则留在原页，未登录允许访问
    if (to.path.toLocaleLowerCase() === '/login') {
      if (authStore.isLogin) return next(from.fullPath)
      return next()
    }

    // 正常访问页面
    next()
  })

  router.afterEach((to) => {
    // 可在此添加埋点或统计
    console.log('[router after each]:', to)
  })

  router.onError((error) => {
    // 统一路由错误处理入口（可结合上报系统）
    console.error('[router error]:', error?.message || error)
  })
}
