import { resetSetupStore } from './plugins'
import { createPinia } from 'pinia'
import type { App } from 'vue'

/** 安装 Pinia 状态管理插件 */
export function setupStore(app: App) {
  const store = createPinia()

  store.use(resetSetupStore)

  app.use(store)
}
