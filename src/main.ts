import { createApp } from 'vue'
import App from './App.vue'
import './plugins/assets'
import { setupI18n } from './locales'
import { setupAppVersionNotification, setupDayjs, setupDirectives, setupIconifyOffline, setupNProgress, setupPWARegister } from './plugins'
import { setupRouter } from './router'
import { setupStore } from './stores'

async function setupApp(): Promise<void> {
  setupNProgress()

  setupIconifyOffline()

  setupDayjs()

  const app = createApp(App)

  setupStore(app)

  await setupRouter(app)

  setupDirectives(app)

  setupI18n(app)

  setupAppVersionNotification()

  setupPWARegister()

  app.mount('#app')
}

void setupApp()
