import dayjs from 'dayjs'

/**
 * 切换 html 的类名
 *
 * @param className 类名
 */
export function toggleHtmlClass(className: string) {
  function add() {
    document.documentElement.classList.add(className)
  }

  function remove() {
    document.documentElement.classList.remove(className)
  }

  return {
    add,
    remove,
  }
}

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式
 */
export function formatDate(date: string | number | Date | undefined, format = 'YYYY-MM-DD') {
  if (!date) return ''
  return dayjs(date).format(format)
}
