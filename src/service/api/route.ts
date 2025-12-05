// import { request } from '@/service/request'
// import servicePort from '../request/servicePort'
import authMenuList from '@/assets/json/authMenuList.json'

/** get constant routes */
export function fetchGetUserRoutes() {
  return authMenuList
  // return request.get<Api.Route.UserRoute>(`${servicePort.route}`)
}
