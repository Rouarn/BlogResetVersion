import http from '@/service/request'
import servicePort from '@/service/request/servicePort'

/**
 * 获取文章列表
 */
export function fetchArticleList(params?: Api.Article.ArticleSearchParams) {
  return http.get<Api.Article.ArticleList>(servicePort.article, params)
}

/**
 * 获取文章详情
 */
export function fetchArticleDetail(id: string | number) {
  return http.get<Api.Article.Article>(`${servicePort.article}/${id}`)
}

/**
 * 创建文章
 */
export function createArticle(data: Api.Article.CreateArticleDto) {
  return http.post(servicePort.article, data)
}

/**
 * 更新文章
 */
export function updateArticle(id: string | number, data: Api.Article.UpdateArticleDto) {
  return http.put(`${servicePort.article}/${id}`, data)
}

/**
 * 删除文章
 */
export function deleteArticle(ids: number[]) {
  return http.delete(servicePort.article, { data: { ids } })
}

/**
 * 文章归档
 */
export function fetchArticleArchive() {
  return http.get<Api.Article.Archive[]>(`${servicePort.article}/archive`)
}
