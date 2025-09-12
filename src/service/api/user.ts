import http from '../request'
import servicePort from '../request/servicePort'

/**
 * 获取用户详细信息
 */
export function fetchUserDetail(userId?: string) {
  return http.get<Api.Auth.UserInfo>(`${servicePort.user}/detail`, { params: { userId } })
}

/**
 * 更新用户信息
 */
export function updateUserInfo(userInfo: Partial<Api.Auth.UserInfo>) {
  return http.put<Api.Auth.UserInfo>(`${servicePort.user}/profile`, userInfo)
}

/**
 * 修改密码
 */
export function changePassword(data: { currentPassword: string; newPassword: string }) {
  return http.put<{ message: string }>(`${servicePort.user}/password`, data)
}

/**
 * 上传头像
 */
export function uploadAvatar(file: File) {
  const formData = new FormData()
  formData.append('avatar', file)
  return http.post<{ avatarUrl: string }>(`${servicePort.user}/avatar`, formData)
}

/**
 * 获取用户登录历史
 */
export function fetchLoginHistory(params?: { current?: number; size?: number }) {
  return http.get<{
    list: Array<{
      id: string
      loginTime: string
      loginIp: string
      userAgent: string
      location?: string
    }>
    total: number
  }>(`${servicePort.user}/login-history`, { params })
}
