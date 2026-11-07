import apiPrefix from '@/service/api/prefix'
import { useAuthStore } from '@/stores/modules/auth'
import { ResultEnum } from '@/enum'
import type { RequestClient } from '@vakao/axios'

export const ENABLE_TOKEN_REFRESH = String(import.meta.env.VITE_ENABLE_TOKEN_REFRESH || 'N').toUpperCase() === 'Y'

let refreshPromise: Promise<boolean> | null = null

/**
 * 刷新 Token
 * @description 这是一个单例模式的刷新 Token 方法，防止并发请求多次刷新
 */
export async function refreshTokenOnce(client: RequestClient): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  const authStore = useAuthStore()
  if (!authStore.refreshToken) return false

  refreshPromise = (async () => {
    try {
      const res = await client.post<App.Service.Response<Api.Auth.LoginToken>>(
        `${apiPrefix.auth}/refresh`,
        { refreshToken: authStore.refreshToken },
        { skipAuthRetry: true, silent: true, loading: false },
      )

      const { code, data } = res
      if (code !== ResultEnum.SUCCESS || !data?.accessToken) {
        return false
      }

      authStore.setToken(data.accessToken)
      authStore.setTokenType(data.tokenType || 'Bearer')
      if (data.refreshToken) authStore.setRefreshToken(data.refreshToken)
      return true
    } catch {
      return false
    }
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}
