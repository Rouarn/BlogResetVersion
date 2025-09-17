import { layouts, views } from '@/router/_generated/imports'
import { routes as elegantRoutes } from '@/router/_generated/routes'
import { transformToVueRoutes } from '@/router/_generated/transformer'
import { builtinRoutes } from './builtin'
import type { RouteRecordRaw } from 'vue-router'

/**
 * @description 📚 路由参数配置简介
 * @param path ==> 路由菜单访问路径
 * @param name ==> 路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选)
 * @param redirect ==> 路由重定向地址
 * @param component ==> 视图文件路径
 * @param meta ==> 路由菜单元信息
 * @param meta.icon ==> 菜单和面包屑对应的图标
 * @param meta.localIcon ==> 本地图标 (设置后 icon 字段将被忽略)
 * @param meta.iconFontSize ==> 图标大小 (宽度和高度相同)
 * @param meta.title ==> 路由标题 (用作 document.title || 菜单的名称)
 * @param meta.i18nKey ==> 路由国际化键 (设置后 title 字段将被忽略)
 * todo 由于当前是静态静态路由方案,暂时不用填写设置,使用时在页面内引入iframe-page组件
 * @param meta.isLink ==> 路由外链时填写的访问地址
 * @param meta.isFull ==> 菜单是否全屏 (示例：数据大屏页面)
 * @param meta.isKeepAlive ==> 当前路由是否缓存
 * @param meta.isAuth ==> 当前路由是否需要登录
 * @param meta.hideInMenu ==> 是否在菜单中隐藏该路由
 * @param meta.multiTab ==> 相同路径不同参数是否使用不同标签页
 * @param meta.query ==> 路由的查询参数
 * */

/** 所有路由 */
export const allRoutes = [...builtinRoutes, ...transformToVueRoutes(elegantRoutes, layouts, views)] as RouteRecordRaw[]
