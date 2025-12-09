import http from '../request'
import servicePort from '../request/servicePort'

/**
 * 获取文章列表
 */

export function fetchArticleList() {
  return http.get<App.Service.Pagination<Api.Article.ArticleDetail>>(`${servicePort.article}`)
}

/**
 * 获取文章详情
 */
export function fetchArticleDetail(articleId: string) {
  return http.get<Api.Article.ArticleDetail>(`${servicePort.article}/${articleId}`)
}

/**
 * 创建文章
 */
export function createArticle(article: Api.Article.CreateArticleRequest) {
  return http.post<void>(`${servicePort.article}`, article)
}

/**
 * 更新文章
 */
export function updateArticle(articleId: string, article: Api.Article.UpdateArticleRequest) {
  return http.put<void>(`${servicePort.article}/${articleId}`, article)
}

/**
 * 删除文章
 */
export function deleteArticle(articleId: string) {
  return http.delete<void>(`${servicePort.article}/${articleId}`)
}
