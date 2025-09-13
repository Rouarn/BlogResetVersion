# Frontend Template

基于 Vue 3、Vite、TypeScript 和 Naive UI 构建的现代化前端开发模板，集成**智能菜单自动生成器**，快速启动项目并简化开发流程。

## ✨ 核心特性

### 🎯 智能菜单自动生成

- 基于文件夹结构自动生成菜单，零配置使用
- 智能判断是否分组（≥2个页面自动分组）
- 自动排除 `_` 开头文件夹和隐藏路由
- 预设常用文件夹图标、标题和排序

### 🏗️ 现代化技术栈

- **Vue 3.5+** + Composition API
- **Vite 7+** 极速开发构建
- **TypeScript 5+** 完整类型安全
- **Naive UI 2+** 现代化组件库
- **UnoCSS** 原子化 CSS 引擎

### 🎨 完整功能支持

- **主题系统**：亮色/暗色/跟随系统，动态主题色
- **国际化**：Vue I18n 支持，动态语言切换
- **自定义指令**：复制、拖拽、水印、防抖等实用指令
- **HTTP 请求**：智能重试、请求取消、类型安全封装
- **开发体验**：自动导入、文件路由、全局搜索

### 📦 工程化配置

- ESLint + Prettier + Husky 代码规范
- Pinia 状态管理
- 响应式设计，移动端适配
- 完整的 TypeScript 类型定义

## 🛠️ 技术栈

### 核心框架

- **Vue 3.5+** - 最新的 Vue 3 版本，性能更优
- **Vite 7+** - 下一代前端构建工具，开发体验极佳
- **TypeScript 5+** - 最新 TypeScript，类型系统更强大

### UI 与样式

- **Naive UI 2+** - 现代化 Vue 3 组件库，组件丰富
- **UnoCSS** - 原子化 CSS 引擎，按需生成样式
- **Iconify** - 统一的图标解决方案，支持 100+ 图标集

### 状态与路由

- **Pinia 3+** - Vue 官方推荐的状态管理库
- **Vue Router 4+** - 官方路由管理器
- **Vue I18n 11+** - 国际化解决方案

### 工具库

- **VueUse** - Vue Composition API 工具集
- **Day.js** - 轻量级日期处理库
- **Axios** - HTTP 客户端库
- **Localforage** - 离线存储库，支持 IndexedDB

### 开发工具

- **ESLint 9+** - 代码质量检查工具
- **Prettier 3+** - 代码格式化工具
- **Husky 9+** - Git hooks 管理工具

## 📺 在线预览

- 🌐 **预览地址**: [http://www.shixian.xyz](http://www.shixian.xyz)
- 📱 **移动端**: 支持手机和平板访问
- 🔍 **功能演示**: 完整的功能展示和交互体验

## 📦 安装与运行

### 环境要求

- Node.js 18+
- pnpm

### 快速开始

```
# 克隆项目
git clone https://github.com/Rouarn/frontend-template.git

# 进入项目目录
cd frontend-template

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 常用命令

```
# 开发
pnpm dev              # 启动开发服务器
pnpm dev:prod         # 生产模式开发

# 构建
pnpm build            # 构建生产版本
pnpm build:dev        # 构建开发版本
pnpm preview          # 预览构建结果

# 代码检查
pnpm typecheck        # TypeScript 类型检查
pnpm lint:eslint      # ESLint 检查并修复
pnpm lint:prettier    # Prettier 格式化
pnpm commit           # 规范化提交
```

## 📁 项目结构

```
src/
├── components/               # 公共组件
├── directives/              # 自定义指令
├── hooks/                   # 组合式函数
├── layouts/                 # 布局组件
├── locales/                # 国际化配置
├── plugins/                # 插件配置
├── router/                 # 路由配置
├── service/               # API 服务
├── stores/                # 状态管理
├── styles/               # 样式文件
├── theme/               # 主题配置
├── typings/             # 类型定义
├── utils/               # 工具函数
└── views/               # 页面组件（菜单自动生成的核心目录）
    ├── _builtin/        # 内置页面（自动排除）
    ├── about/           # 关于页面（单独菜单）
    ├── directives/      # 指令演示页面（自动分组）
    ├── home/            # 首页（单独菜单，优先排序）
    └── user-center/     # 用户中心（可设置隐藏）
```

## 🎯 智能菜单系统

### 零配置使用

基于 `src/views` 文件夹结构自动生成菜单，无需手动配置：

```vue
<!-- src/views/directives/copy-direct/index.vue -->
<route lang="json5">
{
  meta: {
    title: '复制指令',
    // 🎉 无需配置 group，自动根据 directives 文件夹生成分组
  },
}
</route>
```

### 智能分组规则

- **单页面**: 直接显示为独立菜单项
- **多页面**: ≥2个页面自动创建分组
- **自动排除**: `_` 开头文件夹和 `hideInMenu: true` 路由
- **预设配置**: 常用文件夹已预设图标和排序

### 文件夹结构示例

```
src/views/
├── home/           # 单独菜单：首页
├── about/          # 单独菜单：关于
├── directives/     # 自动分组：自定义指令
│   ├── copy-direct/
│   └── drag-direct/
└── _builtin/       # 自动排除：内置页面
```

## 📚 学习资源

### 官方文档

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vite 官方文档](https://cn.vitejs.dev/)
- [Naive UI 组件库](https://www.naiveui.com/)
- [UnoCSS 文档](https://unocss.dev/)
- [Pinia 状态管理](https://pinia.vuejs.org/)

## 🤝 参与贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加新功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 [MIT](LICENSE) 许可证开源 © 2024 Rouarn

## 👨‍💻 作者信息

**Rouarn** - 全栈开发工程师

- 📧 **邮箱**: [woyuxiaji@foxmail.com](mailto:woyuxiaji@foxmail.com)
- 🐙 **GitHub**: [@Rouarn](https://github.com/Rouarn)
- 🌐 **个人网站**: [http://www.shixian.xyz](http://www.shixian.xyz)

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！**

_Built with ❤️ by Rouarn_

</div>
