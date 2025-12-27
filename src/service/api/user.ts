import http from '../request'
import servicePort from '../request/servicePort'

// ==================== 用户信息管理 ====================

/**
 * 创建用户
 */
export function createUser(userData: Api.Auth.UserInfo) {
  return http.post<Api.Auth.UserInfo>(`${servicePort.user}`, userData)
}

/**
 * 获取用户列表
 */
export function fetchUserList(params?: {
  current?: number
  size?: number
  nickname?: string
  email?: string
  roles?: string
  status?: string
}) {
  return http.get<{
    data: Api.Auth.UserInfo[]
    total: number
  }>(`${servicePort.user}`, { params })
}

/**
 * 获取用户详情
 */
export function fetchUserDetail(userId: string) {
  return http.get<Api.Auth.UserInfo>(`${servicePort.user}/${userId}`)
}

/**
 * 更新用户信息
 */
export function updateUserInfo(userId: string, userInfo: Partial<Api.Auth.UserInfo>) {
  return http.patch<Api.Auth.UserInfo>(`${servicePort.user}/${userId}`, userInfo)
}

/**
 * 删除用户
 */
export function deleteUser(userId: string) {
  return http.delete<{ message: string }>(`${servicePort.user}/${userId}`)
}

/**
 * 批量删除用户
 */
export function batchDeleteUsers(userIds: string[]) {
  return http.post<{
    message: string
    deletedCount: number
  }>(`${servicePort.user}/batch-delete`, { ids: userIds })
}

// ==================== 用户状态管理 ====================

/**
 * 启用用户
 */
export function enableUser(userId: string) {
  return http.patch<Api.Auth.UserInfo>(`${servicePort.user}/${userId}/enable`)
}

/**
 * 禁用用户
 */
export function disableUser(userId: string) {
  return http.patch<Api.Auth.UserInfo>(`${servicePort.user}/${userId}/disable`)
}

/**
 * 切换用户状态
 */
export function toggleUserStatus(userId: string, status?: string) {
  return http.patch<Api.Auth.UserInfo>(`${servicePort.user}/${userId}/toggle-status`, { status })
}

/**
 * 检查用户状态
 */
export function checkUserStatus(userId: string) {
  return http.get<{ enabled: boolean }>(`${servicePort.user}/${userId}/status`)
}

// ==================== 文件上传 ====================

/**
 * 上传头像
 */
export function uploadAvatar(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('description', '用户头像')
  formData.append('isPublic', '1')
  return http.upload<{
    fileId: string
    filename: string
    originalName: string
    size: number
    mimeType: string
    path: string
    hash: string
    downloadUrl: string
  }>(`${servicePort.files}/upload`, formData)
}

// ==================== 认证相关 ====================

/**
 * 修改密码
 */
export function changePassword(data: { oldPassword: string; newPassword: string; confirmPassword: string }) {
  return http.put<{ success: boolean; message: string }>(`${servicePort.auth}/change-password`, data)
}

/**
 * 获取用户登录历史
 */
export function fetchLoginHistory(userId: string, params?: { current?: number; size?: number }) {
  return http.get<{
    list: Array<{
      id: string
      loginTime: string
      loginIp: string
      userAgent: string
      location?: string
    }>
    total: number
  }>(`${servicePort.auth}/${userId}/login-history`, { params })
}
