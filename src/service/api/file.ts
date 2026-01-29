import apiPrefix from '@/service/api/prefix'
import http from '@/service/request'

/**
 * 上传文件
 * @param file - 要上传的文件
 * @param description - 文件描述（可选）
 * @param isPublic - 是否公开（0: 私有, 1: 公开，默认0）
 */
export function uploadFile(file: File, description?: string, isPublic: 0 | 1 = 0) {
  const formData = new FormData()
  formData.append('file', file)
  if (description) {
    formData.append('description', description)
  }
  formData.append('isPublic', isPublic.toString())

  return http.upload<Api.File.UploadFileResultDto>(`${apiPrefix.files}/upload`, formData)
}
