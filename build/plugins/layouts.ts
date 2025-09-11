import type { PluginOption } from 'vite'
import Layouts from 'vite-plugin-vue-layouts-next'

export function setupLayoutsPlugin(): PluginOption {
  return Layouts({
    layoutsDirs: ['src/layouts/components'],
    pagesDirs: ['src/views'],
    defaultLayout: 'base-layout',
    exclude: ['**/_*/**'],
    importMode: () => 'async',
  })
}
