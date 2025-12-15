/**
 * 统一 API 前缀
 * - 仅维护资源根路径（不含具体接口路径）
 * - 避免在各 API 文件中硬编码路径前缀
 *
 * 使用示例：
 * - 用户列表：`${servicePort.user}`
 * - 用户详情：`${servicePort.user}/${userId}`
 */
const servicePort = {
  user: '/api/v1/users',
  auth: '/api/v1/auth',
  route: '/api/v1/route',
  files: '/api/v1/files',
  product: '/api/v1/product',
} as const

export type ServicePortKey = keyof typeof servicePort
export default servicePort
