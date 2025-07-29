# 自动菜单生成器使用指南

## 🎯 设计目标

简化Vue路由菜单分组配置，从复杂的手动配置转为基于文件夹结构的自动生成，提升开发效率和新手友好度。

## 📁 工作原理

### 自动分组规则

1. **基于文件夹结构**：根据 `src/views` 下的文件夹自动生成菜单分组
2. **智能分组判断**：只有当文件夹下有 ≥2 个页面时才自动分组，单页面文件夹显示为独立菜单
3. **自动排除规则**：自动排除 `_` 开头的文件夹（如 `_builtin`），支持自定义排除
4. **自动隐藏识别**：自动识别路由中的 `hideInMenu: true` 属性，无需手动配置
5. **预设配置**：常用文件夹已预设图标、标题和排序
6. **零配置使用**：大部分情况下无需任何额外配置
7. **智能排序**：'home' 菜单始终排在第一位，其他菜单按 order 属性升序排列

### 文件夹显示配置

```typescript
const FOLDER_DISPLAY_CONFIG = {
  home: {
    title: '首页',
    icon: 'material-symbols:home-app-logo',
    order: 1,
    i18nKey: 'route.home',
  },
  about: {
    title: '关于',
    icon: 'material-symbols:info',
    order: 999,
    i18nKey: 'route.about',
  },
  directives: {
    title: '自定义指令',
    icon: 'material-icon-theme:folder-vue-directives-open',
    order: 2,
  },
  link: {
    title: '外部链接',
    icon: 'material-symbols:link',
    order: 3,
  },
  // ... 更多预设配置
}
```

## 🚀 使用方式

### 1. 零配置使用（推荐）

只需按文件夹组织页面，无需任何额外配置：

```vue
<!-- src/views/directives/copyDirect/index.vue -->
<route lang="json5">
{
  meta: {
    title: '复制指令',
    // 🎉 无需配置 group，自动根据 directives 文件夹生成分组
    order: 1,
  },
}
</route>
```

### 2. 自定义分组配置

如果需要覆盖自动配置，仍可手动指定：

```vue
<route lang="json5">
{
  meta: {
    title: '特殊页面',
    group: {
      enabled: true,
      title: '自定义分组',
      icon: 'custom-icon',
      order: 10,
    },
  },
}
</route>
```

### 3. 禁用自动分组

```vue
<route lang="json5">
{
  meta: {
    title: '独立页面',
    group: {
      enabled: false, // 明确禁用分组
    },
  },
}
</route>
```

## 📂 文件夹结构示例

```
src/views/
├── home/                 # 单独菜单：只有1个页面，显示为「首页」
│   └── index.vue
├── about/                # 单独菜单：只有1个页面，显示为「关于」
│   └── index.vue
├── directives/           # 自动分组：≥2个页面，生成「自定义指令」分组
│   ├── copyDirect/
│   ├── menuDemo/
│   └── lazyLoad/
├── link/                 # 自动分组：≥2个页面，生成「外部链接」分组
│   ├── github/
│   └── docs/
├── user-center/          # 自动隐藏：路由中设置 hideInMenu: true
│   └── index.vue         # (meta: { hideInMenu: true })
└── _builtin/             # 自动排除：_开头的文件夹
    ├── 404/
    └── login/
```

### 菜单生成结果

基于上述文件夹结构，最终生成的菜单顺序为：

1. **首页** (home - order: 1)
2. **自定义指令** (directives - order: 2)
3. **外部链接** (link - order: 3)
4. **关于** (about - order: 999)

## ⚙️ 配置选项

### 默认配置

```typescript
const DEFAULT_CONFIG = {
  defaultIcon: 'material-symbols:folder', // 默认图标
  defaultOrder: 999, // 默认排序
  customExcludeFolders: [], // 自定义排除的文件夹（默认排除_开头的文件夹）
}
```

### 智能识别规则

- **自动排除**: `_` 开头的文件夹自动排除（如 `_builtin`）
- **自动隐藏**: 识别路由中的 `hideInMenu: true` 属性（如 `user-center`）
- **自动分组**: 根据文件夹内页面数量智能判断
  - 1个页面：显示为独立菜单（如 `home`、`about`）
  - ≥2个页面：自动创建分组（如 `directives`、`link`）
- **自定义排除**: 通过 `customExcludeFolders` 配置额外排除的文件夹

### 添加新的文件夹配置

在 `FOLDER_DISPLAY_CONFIG` 中添加新配置：

```typescript
const FOLDER_DISPLAY_CONFIG = {
  // 现有配置...
  admin: {
    title: '系统管理',
    icon: 'material-symbols:admin-panel-settings',
    order: 8,
    i18nKey: 'route.admin',
  },
}

// 如需自定义排除文件夹
const DEFAULT_CONFIG = {
  // 其他配置...
  customExcludeFolders: ['temp', 'draft'], // 自定义排除的文件夹
}
```

## 🔄 迁移指南

### 从旧配置迁移

**旧方式（复杂）：**

```vue
<route lang="json5">
{
  meta: {
    title: '页面标题',
    group: {
      enabled: true,
      title: '自定义指令',
      icon: 'material-icon-theme:folder-vue-directives-open',
      i18nKey: 'route.directives',
      order: 2,
    },
  },
}
</route>
```

**新方式（简化）：**

```vue
<route lang="json5">
{
  meta: {
    title: '页面标题',
    // 🎉 删除 group 配置，自动处理
  },
}
</route>
```

### 批量迁移脚本

可以创建脚本批量移除不必要的 group 配置：

```bash
# 查找包含 group 配置的文件
find src/views -name "*.vue" -exec grep -l "group:" {} \;

# 手动检查并移除不必要的配置
```

## 🎨 自定义扩展

### 添加新的分组规则

```typescript
// 在 menu-auto-generator.ts 中扩展
function shouldGroupFolder(folder: string, routesInFolder: RouteRecordRaw[]): boolean {
  // 排除的文件夹不分组
  if (shouldExcludeFolder(folder)) {
    return false
  }

  // 单独菜单文件夹不分组（自动判断：只有1个页面）
  if (isSingleMenuFolder(folder, routesInFolder)) {
    return false
  }

  // 添加自定义规则
  if (folder.startsWith('feature-')) {
    return true // 所有 feature- 开头的文件夹都自动分组
  }

  // 默认规则：≥2个页面时分组
  return routesInFolder.length >= 2
}
```

### 动态配置获取

```typescript
function getFolderDisplayConfig(folder: string) {
  // 优先使用预设配置
  if (FOLDER_DISPLAY_CONFIG[folder]) {
    return FOLDER_DISPLAY_CONFIG[folder]
  }

  // 动态生成配置
  if (folder.includes('admin')) {
    return {
      title: `${folder.toUpperCase()} 管理`,
      icon: 'material-symbols:admin-panel-settings',
      order: 100,
    }
  }

  // 回退到默认配置
  return {
    title: folder,
    icon: DEFAULT_CONFIG.defaultIcon,
    order: DEFAULT_CONFIG.defaultOrder,
  }
}
```

## 🐛 故障排除

### 常见问题

1. **分组没有生成**
   - 检查文件夹下是否有 ≥2 个页面
   - 确认文件夹不在 `excludeFolders` 或 `hiddenFolders` 中
   - 确认文件夹不在 `singleMenuFolders` 中（单独菜单不分组）

2. **图标不显示**
   - 检查图标名称是否正确
   - 确认图标库已正确导入
   - 检查 `FOLDER_DISPLAY_CONFIG` 中的图标配置

3. **排序不正确**
   - 'home' 菜单始终排在第一位
   - 其他菜单按 `order` 属性升序排列
   - 检查 `FOLDER_DISPLAY_CONFIG` 中的 order 配置

4. **菜单没有显示**
   - 检查路由是否有效（需要 `meta.title`）
   - 确认文件夹不在隐藏或排除列表中
   - 检查路由路径是否正确

### 调试模式

```typescript
// 在 generateSimpleMenus 函数中添加调试日志
console.log('Valid routes:', validRoutes)
console.log('Folder groups:', folderGroups)
console.log('Final menus:', menus)
```

## 📈 性能优化

- ✅ 减少手动配置工作量 90%
- ✅ 降低新手学习成本
- ✅ 提高配置一致性
- ✅ 支持热更新和类型安全
- ✅ 智能排序：home 菜单优先，其他按 order 排序
- ✅ 灵活的文件夹分类管理

## 🔮 未来规划

- [ ] 支持更多自动规则
- [ ] 可视化配置界面
- [ ] 更智能的图标推荐
- [ ] 国际化自动配置
- [ ] 动态菜单权限控制
- [ ] 菜单缓存优化
