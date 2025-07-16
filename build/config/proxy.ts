import type { Env } from '@/typings/vite-env'
import { consola } from 'consola'
import { bgRed, bgYellow, green, lightBlue } from 'kolorist'
import type { ProxyOptions } from 'vite'

type ProxyTargetList = Record<string, ProxyOptions>

/**
 * 创建代理，用于解析 .env.development 代理配置
 * @param viteEnv  环境变量
 * @param enable   是否开启代理
 */
export function createViteProxy(viteEnv: Env.ImportMeta, enable: boolean) {
  const isEnableHttpProxy = enable && viteEnv.VITE_HTTP_PROXY === 'Y'

  if (!isEnableHttpProxy) return undefined

  const isEnableProxyLog = viteEnv.VITE_PROXY_LOG === 'Y'

  const proxyConfig = viteEnv.VITE_PROXY ? JSON.parse(viteEnv.VITE_PROXY) : []

  const ret: ProxyTargetList = {}
  for (const [prefix, target] of proxyConfig) {
    const httpsRE = /^https:\/\//
    const isHttps = httpsRE.test(target)

    // https://github.com/http-party/node-http-proxy#options
    ret[prefix] = {
      target: target,
      changeOrigin: true,
      // ws: true,
      configure: (_proxy) => {
        _proxy.on('proxyReq', (_proxyReq, req, _res) => {
          if (!isEnableProxyLog) return

          const requestUrl = `${lightBlue('[proxy url]')}: ${bgYellow(` ${req.method} `)} ${green(`${prefix}${req.url}`)}`

          const proxyUrl = `${lightBlue('[real request url]')}: ${green(`${target}${req.url}`)}`

          consola.log(`${requestUrl}\n${proxyUrl}`)
        })
        _proxy.on('error', (_err, req, _res) => {
          if (!isEnableProxyLog) return
          consola.log(bgRed(`Error: ${req.method} `), green(`${target}${req.url}`))
        })
      },
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    }
  }
  return ret
}
