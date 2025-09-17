import { nextTick } from 'vue'
import { useAppStore } from '@/stores/modules/app'
import { useAuthStore } from '@/stores/modules/auth'
import { useRouteStore } from '@/stores/modules/route'
import { useFullscreen } from '@vueuse/core'
import type { RouteLocationRaw, Router } from 'vue-router'

/**
 * 创建路由守卫
 *
 * @param router - 路由实例
 */
export function createRouteGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const routeStore = useRouteStore()

    // 初始化路由菜单 (提供给header菜单使用,路由使用的是基于文件自动生成的)
    if (!routeStore.isInitAuthRoute) {
      await routeStore.initAuthRoute()

      // the route is captured by the "not-found" route because the constant route is not initialized
      // after the constant route is initialized, redirect to the original route
      const path = to.fullPath
      const location: RouteLocationRaw = {
        path,
        replace: true,
        query: to.query,
        hash: to.hash,
      }

      return next(location)
    }

    // 检查是否需要授权
    if (to.meta.isAuth) {
      // 检查是否登录
      if (!authStore.isLogin) {
        // 跳转到登陆页
        return next({ path: '/_builtin/login', replace: false, query: { redirect: to.fullPath } })
      }
    }

    // 判断是否访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
    if (to.path.toLocaleLowerCase() === '/_builtin/login') {
      if (authStore.isLogin) return next(from.fullPath)
      return next()
    }

    // 正常访问页面
    next()
  })

  router.afterEach((to) => {
    // 检查是否需要全屏
    const { isFullscreen, enter, exit } = useFullscreen()

    nextTick(() => {
      const appStore = useAppStore()

      if (to.meta.isFull) {
        enter()
        appStore.setHideHeader(true)
      } else if (isFullscreen.value) {
        exit()
        appStore.setHideHeader(false)
      } else {
        appStore.setHideHeader(false)
      }
    })
  })

  router.onError((error) => {
    console.log('error: ', error.message)
  })
}
