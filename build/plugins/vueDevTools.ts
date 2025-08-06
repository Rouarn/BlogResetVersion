import type { PluginOption } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

export function setupVueDevToolsPlugin(launchEditor: string): PluginOption {
  return vueDevTools({ launchEditor })
}
