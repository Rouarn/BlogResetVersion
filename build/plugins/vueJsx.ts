import vueJsx from '@vitejs/plugin-vue-jsx'
import type { PluginOption } from 'vite'

export function setupVueJsxPlugin(): PluginOption {
  return vueJsx()
}
