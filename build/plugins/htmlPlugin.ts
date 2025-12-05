import type { PluginOption } from 'vite'

export function setupHtmlPlugin(buildTime: string): PluginOption {
  return {
    name: 'html-plugin',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace('<head>', `<head>\n    <meta name="buildTime" content="${buildTime}">`)
    },
  }
}
