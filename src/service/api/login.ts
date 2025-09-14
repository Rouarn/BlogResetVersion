import { request } from '@/service/request'
import servicePort from '@/service/request/servicePort'

/**
 * 用户登录
 * @param userName 用户名
 * @param password 密码
 */
export function fetchLogin(username: string, password: string) {
  return request.post<Api.Auth.LoginToken>(`${servicePort.auth}/login`, {
    username,
    password,
  })
  // 开发环境模拟数据（生产环境请移除）
  return Promise.resolve({
    code: 200,
    data: { accessToken: '123456', username, password },
    message: 'success',
  })
}

/**
 * 获取用户信息
 */
export function fetchUserInfo() {
  return request.get<Api.Auth.UserInfo>(`${servicePort.auth}/getUserInfo`)
  // 开发环境模拟数据（生产环境请移除）
  return Promise.resolve({
    code: 200,
    data: {
      userId: '123456',
      userName: 'admin',
    },
    message: 'success',
  })
}
