import AutoImport from 'unplugin-auto-import/vite'
import type { PluginOption } from 'vite'

export function setupAutoImportPlugin(): PluginOption {
  return AutoImport({
    dts: 'src/typings/auto-imports.d.ts',
    imports: [
      'vue',
      {
        'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
      },
    ],
  })
}
