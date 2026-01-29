// import { request } from '@/service/request'
// import apiPrefix from '../request/apiPrefix'
import authMenuList from '@/assets/json/authMenuList.json'

/** get constant routes */
export function fetchGetUserRoutes() {
  return authMenuList
  // return request.get<Api.Route.UserRoute>(`${apiPrefix.route}`)
}
