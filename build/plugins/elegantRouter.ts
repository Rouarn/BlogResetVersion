import ElegantRouter from 'elegant-router/vite'
import type { PluginOption } from 'vite'

/**
 * 安装并配置 elegant-router 插件
 */
export function setupElegantRouterPlugin(): PluginOption {
  return ElegantRouter()
}
