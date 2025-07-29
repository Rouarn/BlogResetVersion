import logger from '@/utils/logger'
import type { App } from 'vue'

/**
 * Console方法参数类型
 */
type ConsoleArgs = Parameters<typeof console.log>

/**
 * 原始Console方法类型
 */
interface OriginalConsole {
  log: (...args: ConsoleArgs) => void
  info: (...args: ConsoleArgs) => void
  warn: (...args: ConsoleArgs) => void
  error: (...args: ConsoleArgs) => void
  debug: (...args: ConsoleArgs) => void
  trace: (...args: ConsoleArgs) => void
}

/**
 * Console方法名称类型
 */
type ConsoleMethodName = keyof OriginalConsole

/**
 * 获取调用栈信息，显示实际调用位置
 */
function getCallerInfo(): string {
  const stack = new Error().stack
  if (!stack) return ''

  const lines = stack.split('\n')
  // 跳过当前函数、createConsoleReplacement函数和console替换函数的调用栈
  // 通常第4行是实际的调用位置
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i]
    if (line && !line.includes('console.ts') && !line.includes('createConsoleReplacement')) {
      // 提取文件路径和行号信息
      const match = line.match(/\s+at\s+.*?\((.+?):(\d+):(\d+)\)/) || line.match(/\s+at\s+(.+?):(\d+):(\d+)/)
      if (match) {
        const [, filePath, lineNum] = match
        // 拼成可以点击的链接 http://xxx:xxxx
        const clickableLink = `${filePath}:${lineNum}`
        return `${clickableLink}`
      }
    }
  }
  return ''
}

/**
 * 创建console方法替换函数
 * @param methodName console方法名称
 * @param originalMethod 原始console方法
 * @param loggerMethod logger对应方法
 * @param isLogging 递归调用标志的引用
 */
function createConsoleReplacement(
  _methodName: ConsoleMethodName,
  originalMethod: (...args: ConsoleArgs) => void,
  loggerMethod: (...args: ConsoleArgs) => void,
  isLogging: { value: boolean },
): (...args: ConsoleArgs) => void {
  return (...args: ConsoleArgs): void => {
    if (isLogging.value) {
      originalMethod(...args)
      return
    }
    isLogging.value = true
    try {
      // 获取调用位置信息
      const callerInfo = getCallerInfo()
      // 在日志前添加调用位置信息
      if (callerInfo) {
        loggerMethod(callerInfo, ...args)
      } else {
        loggerMethod(...args)
      }
      // 在开发环境中保留原始输出，保持浏览器控制台的可点击跳转功能
      // if (import.meta.env.DEV) {
      //   originalMethod(...args)
      // }
    } finally {
      isLogging.value = false
    }
  }
}

/**
 * 全局console替换插件
 * 将原生console方法替换为自定义logger
 */
export function setupConsoleReplacement(app?: App): () => void {
  // 保存原始console方法的引用
  const originalConsole: OriginalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
    trace: console.trace,
  }

  // 防止递归调用的标志（使用对象引用以便在闭包中共享）
  const isLogging = { value: false }

  // 批量替换console方法
  const consoleMethods: ConsoleMethodName[] = ['log', 'info', 'warn', 'error', 'debug', 'trace']

  consoleMethods.forEach((methodName) => {
    const originalMethod = originalConsole[methodName]
    const loggerMethod = logger[methodName] as (...args: ConsoleArgs) => void

    console[methodName] = createConsoleReplacement(methodName, originalMethod, loggerMethod, isLogging)
  })

  // 如果传入了app实例，将原始console方法挂载到app.config.globalProperties上
  if (app) {
    app.config.globalProperties.$originalConsole = originalConsole
  }

  // 将原始console方法挂载到window上，以便在需要时访问
  if (typeof window !== 'undefined') {
    ;(window as Window & { $originalConsole?: Console }).$originalConsole = originalConsole as unknown as Console
  }

  // 返回恢复函数，用于在需要时恢复原始console
  return function restoreConsole(): void {
    console.log = originalConsole.log
    console.info = originalConsole.info
    console.warn = originalConsole.warn
    console.error = originalConsole.error
    console.debug = originalConsole.debug
    console.trace = originalConsole.trace
  }
}

/**
 * 仅在生产环境替换console的版本
 * 开发环境保持原生console不变
 */
export function setupConsoleReplacementProdOnly(app?: App): () => void {
  if (import.meta.env.PROD) {
    return setupConsoleReplacement(app)
  }
  // 返回一个空函数作为恢复函数，因为在开发环境下没有进行任何console替换
  return function restoreConsole(): void {
    // 开发环境下无需恢复console
  }
}
