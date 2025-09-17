import { createProgressGuard } from './progress'
import { createRouteGuard } from './route'
import { createTitleGuard } from './title'
import type { Router } from 'vue-router'

/**
 * 创建路由守卫
 *
 * @param router - 路由实例
 */
export function createRouterGuard(router: Router) {
  createProgressGuard(router)
  createRouteGuard(router)
  createTitleGuard(router)
}
