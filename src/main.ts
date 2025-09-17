import { createApp } from 'vue'
import App from './App.vue'
import './plugins/assets'
import { setupI18n } from './locales'
import { setupAppVersionNotification, setupDayjs, setupDirectives, setupIconifyOffline, setupNProgress, setupPWARegister } from './plugins'
import { setupRouter } from './router'
import { setupStore } from './stores'

async function setupApp() {
  setupNProgress()

  setupIconifyOffline()

  setupDayjs()

  const app = createApp(App)

  setupDirectives(app)

  setupStore(app)

  setupI18n(app)

  await setupRouter(app)

  setupAppVersionNotification()

  setupPWARegister()

  app.mount('#app')
}

setupApp()
