import { localStg } from '@/utils/storage'
import 'dayjs/locale/en'
import 'dayjs/locale/zh-cn'
import { locale } from 'dayjs'

/**
 * Set dayjs locale
 *
 * @param lang
 */
export function setDayjsLocale(lang: App.I18n.LangType = 'zh-CN') {
  const localMap = {
    'zh-CN': 'zh-cn',
    'en-US': 'en',
  } satisfies Record<App.I18n.LangType, string>

  const l = lang || localStg.get('lang') || 'zh-CN'

  locale(localMap[l])
}
