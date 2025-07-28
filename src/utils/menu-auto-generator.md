# 自动菜单生成器使用指南

## 🎯 设计目标

简化Vue路由菜单分组配置，从复杂的手动配置转为基于文件夹结构的自动生成，提升开发效率和新手友好度。

## 📁 工作原理

### 自动分组规则

1. **基于文件夹结构**：根据 `src/views` 下的文件夹自动生成菜单分组
2. **智能分组判断**：只有当文件夹下有 ≥2 个页面时才自动分组
3. **预设配置**：常用文件夹已预设图标、标题和排序
4. **零配置使用**：大部分情况下无需任何额外配置

### 文件夹映射配置

```typescript
const FOLDER_CONFIG_MAP = {
  directives: {
    title: '自定义指令',
    icon: 'material-icon-theme:folder-vue-directives-open',
    order: 2,
    i18nKey: 'route.directives',
  },
  components: {
    title: '组件示例',
    icon: 'material-symbols:widgets',
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
├── directives/           # 自动生成「自定义指令」分组
│   ├── copyDirect/
│   └── lazyLoad/
├── components/           # 自动生成「组件示例」分组
│   ├── table/
│   └── form/
├── home/                 # 单页面，不自动分组
│   └── index.vue
└── _builtin/             # 排除文件夹，不处理
    ├── 404/
    └── login/
```

## ⚙️ 配置选项

### 默认配置

```typescript
const DEFAULT_CONFIG = {
  defaultIcon: 'material-symbols:folder', // 默认图标
  defaultOrder: 999, // 默认排序
  excludeFolders: ['_builtin', 'components', 'modules'], // 排除的文件夹
  minGroupSize: 2, // 自动分组的最小子项数量
}
```

### 添加新的文件夹配置

在 `FOLDER_CONFIG_MAP` 中添加新配置：

```typescript
const FOLDER_CONFIG_MAP = {
  // 现有配置...
  admin: {
    title: '系统管理',
    icon: 'material-symbols:admin-panel-settings',
    order: 8,
    i18nKey: 'route.admin',
  },
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

### 添加新的自动规则

```typescript
// 在 menu-auto-generator.ts 中扩展
function shouldAutoGroup(routes: RouteRecordRaw[], folder: string): boolean {
  // 添加自定义规则
  if (folder.startsWith('feature-')) {
    return true // 所有 feature- 开头的文件夹都自动分组
  }

  // 原有逻辑...
}
```

### 动态图标配置

```typescript
function getFolderConfig(folder: string) {
  // 动态生成配置
  if (folder.includes('admin')) {
    return {
      title: `${folder.toUpperCase()} 管理`,
      icon: 'material-symbols:admin-panel-settings',
      order: 100,
    }
  }

  // 回退到默认配置
  return FOLDER_CONFIG_MAP[folder] || defaultConfig
}
```

## 🐛 故障排除

### 常见问题

1. **分组没有生成**
   - 检查文件夹下是否有 ≥2 个页面
   - 确认文件夹不在排除列表中

2. **图标不显示**
   - 检查图标名称是否正确
   - 确认图标库已正确导入

3. **排序不正确**
   - 检查 order 配置
   - 确认没有冲突的排序值

### 调试模式

```typescript
// 在 menu-auto-generator.ts 中添加调试日志
console.log('Auto-generated group for folder:', folder, autoGroup)
```

## 📈 性能优化

- ✅ 减少手动配置工作量 90%
- ✅ 降低新手学习成本
- ✅ 提高配置一致性
- ✅ 支持热更新和类型安全

## 🔮 未来规划

- [ ] 支持更多自动规则
- [ ] 可视化配置界面
- [ ] 更智能的图标推荐
- [ ] 国际化自动配置
