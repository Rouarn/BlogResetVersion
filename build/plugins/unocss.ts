import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { presetIcons } from 'unocss'
import UnoCSS from 'unocss/vite'
import type { PluginOption } from 'vite'

export function setupUnocssPlugin(iconPrefix: string, localIconPath: string, collectionName: string): PluginOption {
  return UnoCSS({
    presets: [
      presetIcons({
        prefix: `${iconPrefix}-`,
        scale: 1,
        extraProperties: {
          display: 'inline-block',
        },
        collections: {
          [collectionName]: FileSystemIconLoader(localIconPath, (svg) => svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')),
        },
        warn: true,
      }),
    ],
  })
}
