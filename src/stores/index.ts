import { resetSetupStore } from './plugins'
import { createPinia } from 'pinia'
import type { App } from 'vue'

/** Setup Vue store plugin pinia */
export function setupStore(app: App) {
  const store = createPinia()

  store.use(resetSetupStore)

  app.use(store)
}
