import { localStg } from '@/utils/storage'
import messages from './locale'
import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

// 创建 i18n 实例，配置初始参数
const i18n = createI18n({
  // 设置当前的语言环境，优先从 localStorage 获取，否则默认为 'zh-CN'
  locale: localStg.get('lang') || 'zh-CN',
  // 设置回退语言，默认为英文 'en'
  fallbackLocale: 'en',
  // 提供各个语言的消息内容
  messages,
  // 使用 Composition API 模式（非 legacy 模式）
  legacy: false,
})

/**
 * 插件安装函数：用于在 Vue 应用中注册 i18n
 *
 * @param app - Vue 应用实例
 */
export function setupI18n(app: App) {
  app.use(i18n)
}

// 定义全局 $t 方法，用于翻译文本
export const $t = i18n.global.t as App.I18n.$T

// 定义全局 $te 方法，用于检查是否存在某个翻译键值
export const $te = i18n.global.te

/**
 * 修改当前语言环境
 *
 * @param locale - 要切换的语言类型
 */
export function setLocale(locale: App.I18n.LangType) {
  i18n.global.locale.value = locale
}
