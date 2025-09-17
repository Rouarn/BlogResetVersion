import type { Router } from 'vue-router'

/**
 * 创建进度条守卫
 *
 * @param router - 路由实例
 */
export function createProgressGuard(router: Router) {
  router.beforeEach(() => {
    // NProgress 开始
    window.NProgress?.start?.()
  })

  router.afterEach(() => {
    // NProgress 结束
    window.NProgress?.done?.()
  })

  router.onError(() => {
    // 路由错误时结束进度条
    window.NProgress?.done?.()
  })
}
