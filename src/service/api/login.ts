import { request } from '@/service/request'
import servicePort from '@/service/request/servicePort'

/**
 * 用户登录
 * @param userName 用户名
 * @param password 密码
 */
export function fetchLogin(userName: string, password: string) {
  return request.post<Api.Auth.LoginToken>(`${servicePort.auth}/login`, {
    userName,
    password,
  })
  // 开发环境模拟数据（生产环境请移除）
  // return Promise.resolve({
  //   data: { accessToken: '123456', userName, password },
  //   error: false
  // })
}

/**
 * 获取用户信息
 */
export function fetchUserInfo() {
  return request.get<Api.Auth.UserInfo>(`${servicePort.auth}/getUserInfo`)
  // 开发环境模拟数据（生产环境请移除）
  // return Promise.resolve({
  //   data: {
  //     userId: '123456',
  //     userName: 'admin',
  //   },
  //   error: false
  // })
}
