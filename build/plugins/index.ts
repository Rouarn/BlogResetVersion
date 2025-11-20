import { setupAutoImportPlugin } from './autoImport'
import { setupComponentsPlugin } from './components'
import { setupHtmlPlugin } from './htmlPlugin'
import { setupIconsPlugin } from './icons'
import { setupProgressPlugin } from './progress'
import { setupPWAPlugin } from './pwa'
import { setupSvgIconsPlugin } from './svgIcons'
import { setupUnocssPlugin } from './unocss'
import { setupVuePlugin } from './vue'
import { setupVueDevToolsPlugin } from './vueDevTools'
import { setupVueJsxPlugin } from './vueJsx'
import path from 'path'
import type { PluginOption } from 'vite'

export function setupVitePlugins(viteEnv: Env.ImportMeta, buildTime: string): PluginOption[] {
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX, VITE_DEVTOOLS_LAUNCH_EDITOR } = viteEnv

  /** 本地图标目录的路径 */
  const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon')

  /** 本地图标集合的名称 */
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '')

  const plugins: PluginOption[] = [
    setupVuePlugin(),
    setupVueJsxPlugin(),
    setupVueDevToolsPlugin(String(VITE_DEVTOOLS_LAUNCH_EDITOR)),
    setupUnocssPlugin(VITE_ICON_PREFIX, localIconPath, collectionName),
    setupProgressPlugin(),
    setupAutoImportPlugin(),
    setupComponentsPlugin(VITE_ICON_PREFIX, collectionName),
    setupHtmlPlugin(buildTime),
    setupIconsPlugin(localIconPath, collectionName),
    setupSvgIconsPlugin(localIconPath, VITE_ICON_LOCAL_PREFIX),
    setupPWAPlugin(),
  ]

  return plugins
}
