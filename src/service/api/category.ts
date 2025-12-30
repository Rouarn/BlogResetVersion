import http from '@/service/request'
import servicePort from '@/service/request/servicePort'

/**
 * 获取分类列表
 */
export function fetchCategoryList() {
  return http.get<Api.Category.Category[]>(servicePort.category)
}

/**
 * 获取分类详情
 */
export function fetchCategoryDetail(id: string | number) {
  return http.get<Api.Category.Category>(`${servicePort.category}/${id}`)
}

/**
 * 创建分类
 */
export function createCategory(data: Api.Category.CreateCategoryDto) {
  return http.post(servicePort.category, data)
}

/**
 * 更新分类
 */
export function updateCategory(id: string | number, data: Api.Category.UpdateCategoryDto) {
  return http.put(`${servicePort.category}/${id}`, data)
}

/**
 * 删除分类
 */
export function deleteCategory(ids: number[]) {
  return http.delete(servicePort.category, { data: { ids } })
}
