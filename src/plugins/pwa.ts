// 注册 PWA Service Worker
import { registerSW } from 'virtual:pwa-register'

export function setupPWARegister() {
  // 监听 PWA 状态
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('PWA 需要刷新')
    },
    onOfflineReady() {
      console.log('PWA 离线可用')
    },
  })
}
