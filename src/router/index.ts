import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { createRouterGuard } from '@/router/guard'
import { builtinRoutes } from './routes'
import type { App } from 'vue'

const mode = import.meta.env.VITE_ROUTER_MODE as 'hash' | 'history' | 'memory'

const routerMode = {
  hash: () => createWebHashHistory(),
  history: () => createWebHistory(),
  memory: () => createMemoryHistory(),
}
const router = createRouter({
  history: routerMode[mode](),
  routes: builtinRoutes,
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

/** 设置Vue路由 */
export async function setupRouter(app: App) {
  app.use(router)
  createRouterGuard(router)
  await router.isReady()
}

export default router
