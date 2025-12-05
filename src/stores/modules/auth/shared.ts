import { localStg } from '@/utils/storage'

/** 获取令牌 */
export function getToken() {
  return localStg.get('token') || ''
}

export function getRefreshToken() {
  return localStg.get('refreshToken') || ''
}

export function getTokenExpiresAt() {
  return Number(localStg.get('tokenExpiresAt') || 0)
}

export function getRefreshTokenExpiresAt() {
  return Number(localStg.get('refreshTokenExpiresAt') || 0)
}

export function getTokenType() {
  return (localStg.get('tokenType') as string) || 'Bearer'
}

/** 清除认证存储 */
export function clearAuthStorage() {
  localStg.remove('token')
  localStg.remove('refreshToken')
  localStg.remove('tokenExpiresAt')
  localStg.remove('refreshTokenExpiresAt')
  localStg.remove('tokenType')
}
