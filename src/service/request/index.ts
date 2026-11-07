import router from '@/router'
import { useAuthStore } from '@/stores/modules/auth'
import { toRequestError } from './error'
import { ENABLE_TOKEN_REFRESH, refreshTokenOnce } from './refresh'
import type { OptimizedResponse } from './types'
import { buildSuccessResponse } from './utils'
import { ResultEnum, RouteNameEnum } from '@/enum'
import { createClient, type RequestOptions } from '@vakao/axios'
import type { AxiosRequestConfig } from 'axios'

/**
 * 请求客户端
 * - 后端信封解包交给 contract（这里保持返回完整信封，由 buildSuccessResponse 统一处理）
 * - token 注入、401 单例刷新并重放、重复请求取消、全局 loading、统一错误出口由库内置
 */
const client = createClient({
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL,
  timeout: Number(ResultEnum.TIMEOUT) || 10000,
  withCredentials: true,
  headers: {
    'X-Api-Version': 1,
  },
  contract: {
    successCode: ResultEnum.SUCCESS,
    unwrap: (body) => body,
  },
  auth: {
    getToken: () => {
      const authStore = useAuthStore()
      return authStore.token ? `${authStore.tokenType} ${authStore.token}` : ''
    },
    /** 未开启刷新时直接视为失败，走 onRefreshFailed 清理登录态 */
    onRefresh: async (requestClient) => (ENABLE_TOKEN_REFRESH ? refreshTokenOnce(requestClient) : false),
    onRefreshFailed: async () => {
      const authStore = useAuthStore()
      authStore.setToken('')
      authStore.setRefreshToken('')
      await router.replace(`/${RouteNameEnum.LOGIN}`)
    },
  },
  onLoading: (pending) => {
    if (pending) window.$loading?.open()
    else window.$loading?.close()
  },
  onError: (error) => {
    window.$message?.error(toRequestError(error).message)
  },
})

/* ===================== 请求方法封装 ===================== */

/**
 * 发送请求
 * @param method 请求方法
 * @param url 请求地址
 * @param payload 请求数据 (GET/DELETE 为 params / body)
 * @param config 请求选项
 * @param isDownload 是否为下载请求（返回原始二进制）
 */
async function sendRequest<T>(
  method: string,
  url: string,
  payload?: unknown,
  config: RequestOptions = {},
  isDownload = false,
): Promise<OptimizedResponse<T>> {
  const options: RequestOptions = { loading: true, ...config }
  let res: unknown

  if (method === 'GET') {
    res = await client.get<unknown>(url, payload as object, options)
  } else if (method === 'DELETE') {
    // DELETE 带请求体：RequestClient 的 delete 只支持 params，这里走原始实例发送
    res = await client.instance.request<unknown, unknown>({
      ...options,
      url,
      method,
      data: payload,
    } as AxiosRequestConfig)
  } else {
    res = await client.post<unknown>(url, payload, options)
  }

  return buildSuccessResponse<T>(res, isDownload)
}

export const request = {
  /** 发送 GET 请求 */
  get<T>(url: string, params?: object, config?: RequestOptions) {
    return sendRequest<T>('GET', url, params, config)
  },

  /** 发送 POST 请求 */
  post<T>(url: string, data?: unknown, config?: RequestOptions) {
    return sendRequest<T>('POST', url, data, config)
  },

  /** 发送 PUT 请求 */
  put<T>(url: string, data?: unknown, config?: RequestOptions) {
    return sendRequest<T>('PUT', url, data, config)
  },

  /** 发送 DELETE 请求 */
  delete<T>(url: string, params?: object, config?: RequestOptions) {
    return sendRequest<T>('DELETE', url, params, config)
  },

  /** 发送 PATCH 请求 */
  patch<T>(url: string, data?: unknown, config?: RequestOptions) {
    return sendRequest<T>('PATCH', url, data, config)
  },

  /** 上传文件 (自动设置 Content-Type: multipart/form-data) */
  upload<T>(url: string, form: FormData, config?: RequestOptions) {
    return client
      .upload<App.Service.Response<T>>(url, form, { loading: false, ...config })
      .then((res) => buildSuccessResponse<T>(res, false))
  },

  /** 下载文件 (返回 Blob) */
  download(url: string, params?: object, config?: RequestOptions) {
    return sendRequest<Blob>('POST', url, params, { ...config, responseType: 'blob' }, true)
  },

  /** 取消所有请求 */
  cancelAll() {
    client.cancelAll()
  },

  /** 暴露请求客户端（含原始 Axios 实例 client.instance） */
  instance: client,
}

export default request
