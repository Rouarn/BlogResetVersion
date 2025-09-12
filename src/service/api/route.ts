import { request } from '@/service/request'

/** get constant routes */
export function fetchGetUserRoutes() {
  return request.get<Api.Route.UserRoute>('/route/getUserRoutes')
}
