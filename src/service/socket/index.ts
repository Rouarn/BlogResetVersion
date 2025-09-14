/**
 * Socket.IO 客户端服务模块
 *
 * 功能说明:
 * - 提供 WebSocket 连接管理
 * - 实现消息发送和接收
 * - 支持房间管理功能
 * - 提供连接状态监控
 *
 * 特点:
 * - 自动重连机制
 * - 事件驱动架构
 * - 类型安全的消息处理
 * - 完整的错误处理
 *
 * @author Frontend Template
 * @version 1.0.0
 */

export * from './events'
export { SocketManager } from './manager'
export { socketManager } from './manager'
export * from './types'
export * from './utils'
