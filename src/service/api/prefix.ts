/**
 * 统一 API 前缀配置
 * - 配合 @vakao-ui/axios 使用
 * - 仅维护资源根路径，不包含 baseURL
 */
const apiPrefixConfig = {
  // 用户模块
  user: '/api/users',
  // 认证模块
  auth: '/api/auth',
  // 路由/菜单模块
  route: '/api/route',
  // 文件上传/下载模块
  files: '/api/files',
} as const

export type ApiPrefixKey = keyof typeof apiPrefixConfig
export default apiPrefixConfig
