import VueRouter from 'unplugin-vue-router/vite'
import type { PluginOption } from 'vite'

export function setupVueRouterPlugin(): PluginOption {
  return VueRouter({
    routesFolder: ['src/views'],
    dts: 'src/typings/typed-router.d.ts',
    extensions: ['.vue', '.tsx'],
    exclude: ['**/components/*.vue', '**/modules/*.vue', '**/_*/**'],
    routeBlockLang: 'json5',
    importMode: 'async',
  })
}
