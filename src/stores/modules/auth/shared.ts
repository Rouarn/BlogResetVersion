import { localStg } from '@/utils/storage'

/** 获取令牌 */
export function getToken() {
  return localStg.get('token') || ''
}

export function getRefreshToken() {
  return localStg.get('refreshToken') || ''
}

export function getTokenType() {
  return (localStg.get('tokenType') as string) || 'Bearer'
}
