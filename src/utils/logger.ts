import { consola } from 'consola'

/**
 * 日志工具
 * 提供在IDE终端中打印输出的功能
 *
 * 日志级别：
 * - 0: Fatal and Error
 * - 1: Warnings
 * - 2: Normal logs
 * - 3: Informational logs, success, fail, ready, start, ...
 * - 4: Debug logs
 * - 5: Trace logs
 */

// 创建一个自定义的logger实例
export const logger = consola.create({
  // 在开发环境中设置更详细的日志级别
  level: process.env.NODE_ENV === 'development' ? 4 : 3,
})

// 创建带有标签的日志记录器
export const menuLogger = logger.withTag('menu')
export const routeLogger = logger.withTag('route')

// 导出原始consola实例，以便直接使用
export { consola }

// 默认导出logger
export default logger
