import apiPrefix from '@/service/api/prefix'
import http from '@/service/request'

/**
 * 获取分类列表
 */
export function fetchCategoryList() {
  return http.get<Api.Category.Category[]>(apiPrefix.category, {}, { loading: false })
}

/**
 * 获取分类详情
 */
export function fetchCategoryDetail(id: string | number) {
  return http.get<Api.Category.Category>(`${apiPrefix.category}/${id}`)
}

/**
 * 创建分类
 */
export function createCategory(data: Api.Category.CreateCategoryDto) {
  return http.post<Api.Category.Category>(apiPrefix.category, data)
}

/**
 * 更新分类
 */
export function updateCategory(id: string | number, data: Api.Category.UpdateCategoryDto) {
  return http.put(`${apiPrefix.category}/${id}`, data)
}

/**
 * 删除分类
 */
export function deleteCategory(ids: number[]) {
  return http.delete(apiPrefix.category, { data: { ids } })
}
