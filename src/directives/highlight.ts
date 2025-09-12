import type { Directive, DirectiveBinding } from 'vue'

interface HighlightElement extends HTMLElement {
  __highlightOriginalHTML__?: string
}

interface HighlightOptions {
  keyword: string | string[]
  className?: string
  style?: Partial<CSSStyleDeclaration>
  caseSensitive?: boolean
  wholeWord?: boolean
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function kebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function createHighlightTag(options: HighlightOptions): { start: string; end: string } {
  let styleAttr = ''

  if (options.style) {
    const styles = Object.entries(options.style)
      .map(([key, value]) => `${kebabCase(key)}: ${value}`)
      .join('; ')
    styleAttr = ` style="${styles}"`
  }

  const className = options.className || 'highlight'

  return {
    start: `<span class="${className}"${styleAttr}>`,
    end: '</span>',
  }
}

function highlightText(html: string, options: HighlightOptions): string {
  const keywords = Array.isArray(options.keyword) ? options.keyword : [options.keyword]

  if (keywords.length === 0 || keywords.every((k) => !k)) {
    return html
  }

  let result = html

  keywords.forEach((keyword) => {
    if (!keyword.trim()) return

    // 转义特殊字符
    const escapedKeyword = escapeRegExp(keyword)
    const { start, end } = createHighlightTag(options)

    // 构建正则表达式
    let pattern = escapedKeyword
    if (options.wholeWord) {
      pattern = `\\b${pattern}\\b`
    }

    const flags = options.caseSensitive ? 'g' : 'gi'
    const regex = new RegExp(pattern, flags)

    // 执行替换，避免替换已经高亮的内容
    result = result.replace(regex, (match) => {
      // 检查是否已经在标签内
      const beforeMatch = result.substring(0, result.indexOf(match))
      const openTags = (beforeMatch.match(/<[^>]*>/g) || []).length
      const closeTags = (beforeMatch.match(/<\/[^>]*>/g) || []).length

      // 如果在标签内，不进行替换
      if (openTags !== closeTags) {
        return match
      }

      return `${start}${match}${end}`
    })
  })

  return result
}

function parseOptions(value: unknown): HighlightOptions {
  if (typeof value === 'string') {
    return {
      keyword: value,
      className: 'highlight',
      caseSensitive: false,
      wholeWord: false,
    }
  }

  if (Array.isArray(value)) {
    return {
      keyword: value,
      className: 'highlight',
      caseSensitive: false,
      wholeWord: false,
    }
  }

  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>
    return {
      keyword: obj.keyword as string | string[],
      className: (obj.className as string) || 'highlight',
      style: obj.style as Partial<CSSStyleDeclaration> | undefined,
      caseSensitive: (obj.caseSensitive as boolean) || false,
      wholeWord: (obj.wholeWord as boolean) || false,
    }
  }

  return {
    keyword: '',
    className: 'highlight',
    caseSensitive: false,
    wholeWord: false,
  }
}

function updateHighlight(el: HighlightElement, binding: DirectiveBinding) {
  const options = parseOptions(binding.value)

  if (!options.keyword) {
    // 如果没有关键词，恢复原始内容
    if (el.__highlightOriginalHTML__) {
      el.innerHTML = el.__highlightOriginalHTML__
    }
    return
  }

  // 获取原始文本内容
  const originalHTML = el.__highlightOriginalHTML__ || el.innerHTML

  // 执行高亮处理
  const highlightedHTML = highlightText(originalHTML, options)

  // 更新元素内容
  el.innerHTML = highlightedHTML
}

/**
 * v-highlight 文本高亮指令
 * 用法：
 * <div v-highlight="'关键词'">包含关键词的文本</div>
 * <div v-highlight="{ keyword: '关键词', className: 'highlight', caseSensitive: false }">文本</div>
 * <div v-highlight="{ keyword: ['关键词1', '关键词2'], style: { backgroundColor: 'yellow' } }">文本</div>
 */
const highlight: Directive = {
  mounted(el: HighlightElement, binding: DirectiveBinding) {
    // 保存原始HTML内容
    el.__highlightOriginalHTML__ = el.innerHTML
    updateHighlight(el, binding)
  },

  updated(el: HighlightElement, binding: DirectiveBinding) {
    updateHighlight(el, binding)
  },

  beforeUnmount(el: HighlightElement) {
    // 恢复原始内容
    if (el.__highlightOriginalHTML__) {
      el.innerHTML = el.__highlightOriginalHTML__
    }
  },
}

// 添加默认样式
if (typeof document !== 'undefined') {
  const styleId = 'v-highlight-default-styles'

  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      .highlight {
        background-color: #ffeb3b;
        color: #333;
        padding: 1px 2px;
        border-radius: 2px;
        font-weight: 500;
      }

      .highlight-primary {
        background-color: #2196f3;
        color: white;
        padding: 1px 4px;
        border-radius: 3px;
      }

      .highlight-success {
        background-color: #4caf50;
        color: white;
        padding: 1px 4px;
        border-radius: 3px;
      }

      .highlight-warning {
        background-color: #ff9800;
        color: white;
        padding: 1px 4px;
        border-radius: 3px;
      }

      .highlight-error {
        background-color: #f44336;
        color: white;
        padding: 1px 4px;
        border-radius: 3px;
      }
    `
    document.head.appendChild(style)
  }
}

// 导出高亮辅助函数
export const HighlightHelper = {
  /**
   * 手动高亮文本
   */
  highlightText(text: string, keyword: string | string[], options: Partial<HighlightOptions> = {}): string {
    const fullOptions: HighlightOptions = {
      keyword,
      className: 'highlight',
      caseSensitive: false,
      wholeWord: false,
      ...options,
    }

    return highlightText(text, fullOptions)
  },

  /**
   * 移除高亮标签
   */
  removeHighlight(html: string): string {
    return html.replace(/<span[^>]*class="[^"]*highlight[^"]*"[^>]*>(.*?)<\/span>/gi, '$1')
  },

  /**
   * 获取高亮的关键词数量
   */
  getHighlightCount(html: string): number {
    const matches = html.match(/<span[^>]*class="[^"]*highlight[^"]*"[^>]*>/gi)
    return matches ? matches.length : 0
  },
}

export default highlight
