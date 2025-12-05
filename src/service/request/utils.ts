/**
 * 稳定序列化：按 key 排序，确保对象等价时字符串一致
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
 * 计算重试延迟：支持指数退避与抖动
 */
export function computeRetryDelay(
  attempt: number,
  baseDelay: number,
  options?: { backoff?: 'linear' | 'exponential'; jitter?: boolean; maxDelay?: number },
): number {
  const backoff = options?.backoff ?? 'exponential'
  const maxDelay = options?.maxDelay ?? baseDelay * 8
  const jitter = options?.jitter ?? true

  let delay = baseDelay
  if (backoff === 'exponential') {
    delay = Math.min(Math.max(baseDelay, 1) * Math.pow(2, Math.max(attempt - 1, 0)), maxDelay)
  } else {
    delay = Math.min(baseDelay * Math.max(attempt, 1), maxDelay)
  }

  if (jitter) {
    const half = Math.floor(delay / 2)
    delay = half + Math.floor(Math.random() * (delay - half + 1))
  }
  return delay
}
