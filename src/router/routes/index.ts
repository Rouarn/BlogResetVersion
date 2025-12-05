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
 * @param meta.isLink ==> 路由外链时填写的访问地址
 * @param meta.isFull ==> 菜单是否全屏 (示例：数据大屏页面)
 * @param meta.isKeepAlive ==> 当前路由是否缓存
 * @param meta.isAuth ==> 当前路由是否需要登录
 * @param meta.hideInMenu ==> 是否在菜单中隐藏该路由
 * @param meta.query ==> 路由的查询参数
 * @param meta.menuType ==> 菜单类型 (1: 目录; 2: 菜单)
 * */

import { ERROR_ROUTER, ROOT_ROUTE, STATIC_ROUTER } from './builtin'
import type { RouteRecordRaw } from 'vue-router'

/** builtin routes, it must be constant and setup in vue-router */
export const builtinRoutes: RouteRecordRaw[] = [ROOT_ROUTE, ...STATIC_ROUTER, ...ERROR_ROUTER]
