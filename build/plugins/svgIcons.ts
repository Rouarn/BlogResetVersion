import type { PluginOption } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export function setupSvgIconsPlugin(localIconPath: string, iconLocalPrefix: string): PluginOption {
  return createSvgIconsPlugin({
    iconDirs: [localIconPath],
    symbolId: `${iconLocalPrefix}-[dir]-[name]`,
    inject: 'body-last',
    customDomId: '__SVG_ICON_LOCAL__',
  })
}
