import { $t } from '@/locales'
import { useTitle } from '@vueuse/core'
import type { Router } from 'vue-router'

/**
 * 创建标题守卫
 *
 * @param router - 路由实例
 */
export function createTitleGuard(router: Router) {
  router.beforeEach((to) => {
    // 动态设置标题
    const AppTitle = $t('system.title')
    const { title, i18nKey } = to.meta
    const subTitle = i18nKey ? $t(i18nKey) : (title ?? '')
    const documentTitle = subTitle ? `${subTitle} - ${AppTitle}` : AppTitle
    useTitle(documentTitle)
  })
}
