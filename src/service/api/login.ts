import http from '@/service/request'
import { AUTH_API_PREFIX } from '@/service/request/servicePort'

/**
 * 用户登录
 * @param userName 用户名
 * @param password 密码
 */
export function fetchLogin(userName: string, password: string) {
  return http.post<Api.Auth.LoginToken>(`${AUTH_API_PREFIX}/login`, {
    userName,
    password,
  })
  // return Promise.resolve({
  //   code: 200,
  //   data: { token: '123456', userName, password },
  // })
}

/**
 * 获取用户信息
 */
export function fetchUserInfo() {
  return http.get<Api.Auth.UserInfo>(`${AUTH_API_PREFIX}/getUserInfo`)
}
