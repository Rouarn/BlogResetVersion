/**
 * 获取错误原因
 */
export function getReasonForError(error: App.Service.Response<unknown>): string {
  if (!error) return ''

  // 提取错误信息
  const message = error.message || ''
  const data = error.data || {}

  // 收集所有错误原因
  const reasons: string[] = []

  // 遍历 data 对象，收集所有数组类型的错误信息
  Object.values(data).forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach((reason) => {
        if (typeof reason === 'string' && reason.trim()) {
          reasons.push(reason.trim())
        }
      })
    }
  })

  // 构建最终错误信息
  let result = message

  if (reasons.length > 0) {
    result += '\n原因：'
    reasons.forEach((reason, index) => {
      result += `\n${index + 1}.${reason}`
    })
  }

  return result
}
