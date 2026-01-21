/**
 * 稳定序列化
 * - 按对象 key 排序，确保等价对象得到一致字符串
 * - 用于生成请求唯一 key（method/url/params/data）
 */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(',')}]`
  const obj = value as Record<string, unknown>
  const keys = Object.keys(obj).sort()
  const entries = keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
  return `{${entries.join(',')}}`
}

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
