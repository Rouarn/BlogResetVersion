import apiPrefix from '@/service/api/prefix'
import http from '@/service/request'

/**
 * 获取文章列表
 */
export function fetchArticleList(params?: Api.Article.ArticleSearchParams) {
  return http.get<Api.Article.ArticleList>(apiPrefix.article, params, { loading: false })
}

/**
 * 获取文章详情
 */
export function fetchArticleDetail(id: string | number) {
  return http.get<Api.Article.Article>(`${apiPrefix.article}/${id}`)
}

/**
 * 创建文章
 */
export function createArticle(data: Api.Article.CreateArticleDto) {
  return http.post(apiPrefix.article, data)
}

/**
 * 更新文章
 */
export function updateArticle(id: string | number, data: Api.Article.UpdateArticleDto) {
  return http.put(`${apiPrefix.article}/${id}`, data)
}

/**
 * 删除文章
 */
export function deleteArticle(ids: number[]) {
  return http.delete(apiPrefix.article, { data: { ids } })
}

/**
 * 文章归档
 */
export function fetchArticleArchive() {
  return http.get<Api.Article.Archive[]>(`${apiPrefix.article}/archive`)
}

/**
 * 点赞文章
 */
export function likeArticle(id: string | number) {
  return http.patch<number>(`${apiPrefix.article}/${id}/like`)
}
