import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import Icons from 'unplugin-icons/vite'
import type { PluginOption } from 'vite'

export function setupIconsPlugin(localIconPath: string, collectionName: string): PluginOption {
  return Icons({
    compiler: 'vue3',
    customCollections: {
      [collectionName]: FileSystemIconLoader(localIconPath, (svg) => svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')),
    },
    scale: 1,
    defaultClass: 'inline-block',
  })
}
