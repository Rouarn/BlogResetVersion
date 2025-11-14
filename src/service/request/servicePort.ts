/**
 * 定义统一 API 前缀
 * - 仅维护资源根路径，不含具体接口
 */
const servicePort = {
  user: '/api/v1/users',
  auth: '/api/v1/auth',
  route: '/api/v1/route',
  files: '/api/v1/files',
  product: '/api/v1/product',
}

export default servicePort
