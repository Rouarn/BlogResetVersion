import { request } from '@/service/request'
import servicePort from '../request/servicePort'

/** get constant routes */
export function fetchGetUserRoutes() {
  return request.get<Api.Route.UserRoute>(`${servicePort.route}`)
}
