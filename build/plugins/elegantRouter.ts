import ElegantRouter from 'elegant-router/vite'
import type { PluginOption } from 'vite'

/**
 * Setup elegant-router plugin
 */
export function setupElegantRouterPlugin(): PluginOption {
  return ElegantRouter()
}
