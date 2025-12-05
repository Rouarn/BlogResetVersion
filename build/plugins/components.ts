import IconsResolver from 'unplugin-icons/resolver'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import type { PluginOption } from 'vite'

export function setupComponentsPlugin(iconPrefix: string, collectionName: string): PluginOption {
  return Components({
    dts: 'src/typings/components.d.ts',
    types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
    resolvers: [NaiveUiResolver(), IconsResolver({ customCollections: [collectionName], componentPrefix: iconPrefix })],
  })
}
