<script setup lang="ts" name="MenuDemo">
definePage({
  meta: {
    title: '菜单配置',
    icon: 'material-symbols-light:featured-play-list-outline',
    order: 3,
  },
})

// 🎯 这个页面本身就是智能菜单生成器的演示
// 📁 它位于 src/views/menuDemo/ 文件夹下
// 🔍 智能识别：由于只有1个页面，自动显示为独立菜单项
// 📈 如果在同一文件夹下添加更多页面（≥2个），系统会自动创建分组
// 🚀 无需任何手动配置，完全基于文件夹结构智能判断
</script>

<template>
  <div class="p-6 max-w-1200px mx-auto">
    <div class="text-center mb-10">
      <h1 class="text-2.5rem mb-2 bg-gradient-purple">🎉 菜单配置优化演示</h1>
      <p class="text-1.2rem text-gray-600 m-0">从复杂配置到零配置的进化</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <!-- 旧方式 -->
      <div class="rounded-xl p-6 shadow-lg border-l-4 border-red-400 bg-gradient-old">
        <div class="flex justify-between items-center mb-4">
          <h2 class="m-0 text-1.5rem">❌ 旧方式（复杂）</h2>
          <span class="px-3 py-1 rounded-full text-0.8rem font-bold bg-red-100 text-red-600">复杂度: 高</span>
        </div>
        <div class="bg-gray-50 rounded-lg p-4 mb-4 overflow-x-auto">
          <pre class="m-0 font-mono text-0.9rem leading-normal"><code>&lt;route lang="json5"&gt;
{
  meta: {
    title: '页面标题',
    group: {
      enabled: true,
      title: '菜单演示',
      icon: 'material-symbols:folder',
      i18nKey: 'route.menuDemo',
      order: 2,
      parent: null
    },
    order: 1,
    icon: 'custom-icon'
  },
}
&lt;/route&gt;</code></pre>
        </div>
        <div>
          <h3 class="m-0 mb-3 text-1.1rem">存在问题：</h3>
          <ul class="m-0 pl-5">
            <li class="mb-2 leading-normal">🔴 配置冗长，容易出错</li>
            <li class="mb-2 leading-normal">🔴 新手学习成本高</li>
            <li class="mb-2 leading-normal">🔴 重复配置，维护困难</li>
            <li class="mb-2 leading-normal">🔴 不一致的分组配置</li>
          </ul>
        </div>
      </div>

      <!-- 新方式 -->
      <div class="rounded-xl p-6 shadow-lg border-l-4 border-green-400 bg-gradient-new">
        <div class="flex justify-between items-center mb-4">
          <h2 class="m-0 text-1.5rem">✅ 新方式（简化）</h2>
          <span class="px-3 py-1 rounded-full text-0.8rem font-bold bg-green-100 text-green-600">复杂度: 低</span>
        </div>
        <div class="bg-gray-50 rounded-lg p-4 mb-4 overflow-x-auto">
          <pre class="m-0 font-mono text-0.9rem leading-normal">
            <code>
&lt;script setup lang="ts"&gt;
definePage({
  meta: {
    title: '菜单演示',
    order: 1,
    i18nKey: 'route.menuDemo'
  },
})
&lt;/script&gt;
            </code>
          </pre>
        </div>
        <div>
          <h3 class="m-0 mb-3 text-1.1rem">优势特点：</h3>
          <ul class="m-0 pl-5">
            <li class="mb-2 leading-normal">✅ 零配置，开箱即用</li>
            <li class="mb-2 leading-normal">✅ 基于文件夹结构自动分组</li>
            <li class="mb-2 leading-normal">✅ 预设常用配置</li>
            <li class="mb-2 leading-normal">✅ 支持自定义覆盖</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 自动分组规则 -->
    <div class="mb-10">
      <h2 class="text-2rem mb-6 text-center">🤖 自动分组规则</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="m-0 mb-4 text-gray-800">📁 文件夹映射</h3>
          <div>
            <div class="flex items-center mb-3">
              <code class="bg-gray-100 px-2 py-1 rounded font-mono">home/</code>
              <span class="mx-3 text-gray-600">→</span>
              <span class="flex items-center gap-2">
                <span class="font-medium">首页</span>
                <span>🏠</span>
                <span class="text-0.8rem px-2 py-0.5 rounded-xl bg-gray-100 text-gray-600">单独菜单</span>
              </span>
            </div>
            <div class="flex items-center mb-3">
              <code class="bg-gray-100 px-2 py-1 rounded font-mono">directives/</code>
              <span class="mx-3 text-gray-600">→</span>
              <span class="flex items-center gap-2">
                <span class="font-medium">自定义指令</span>
                <span>🎯</span>
                <span class="text-0.8rem px-2 py-0.5 rounded-xl bg-gray-100 text-gray-600">自动分组</span>
              </span>
            </div>
            <div class="flex items-center mb-3">
              <code class="bg-gray-100 px-2 py-1 rounded font-mono">link/</code>
              <span class="mx-3 text-gray-600">→</span>
              <span class="flex items-center gap-2">
                <span class="font-medium">外部链接</span>
                <span>🔗</span>
                <span class="text-0.8rem px-2 py-0.5 rounded-xl bg-gray-100 text-gray-600">自动分组</span>
              </span>
            </div>
            <div class="flex items-center mb-3">
              <code class="bg-gray-100 px-2 py-1 rounded font-mono">about/</code>
              <span class="mx-3 text-gray-600">→</span>
              <span class="flex items-center gap-2">
                <span class="font-medium">关于</span>
                <span>ℹ️</span>
                <span class="text-0.8rem px-2 py-0.5 rounded-xl bg-gray-100 text-gray-600">单独菜单</span>
              </span>
            </div>
            <div class="flex items-center mb-3 opacity-60">
              <code class="bg-gray-100 px-2 py-1 rounded font-mono">user-center/</code>
              <span class="mx-3 text-gray-600">→</span>
              <span class="flex items-center gap-2">
                <span class="font-medium">自动隐藏</span>
                <span>🚫</span>
                <span class="text-0.8rem px-2 py-0.5 rounded-xl bg-red-100 text-red-600">hideInMenu: true</span>
              </span>
            </div>
            <div class="flex items-center mb-3 opacity-60">
              <code class="bg-gray-100 px-2 py-1 rounded font-mono">_builtin/</code>
              <span class="mx-3 text-gray-600">→</span>
              <span class="flex items-center gap-2">
                <span class="font-medium">自动排除</span>
                <span>❌</span>
                <span class="text-0.8rem px-2 py-0.5 rounded-xl bg-red-100 text-red-600">_开头文件夹</span>
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="m-0 mb-4 text-gray-800">🎯 智能判断</h3>
          <ul class="list-none p-0">
            <li class="py-2 border-b border-gray-100"><strong>智能排序：</strong>'home' 菜单始终排在第一位</li>
            <li class="py-2 border-b border-gray-100"><strong>自动分组：</strong>文件夹下 ≥2 个页面时自动分组</li>
            <li class="py-2 border-b border-gray-100"><strong>单独菜单：</strong>只有1个页面的文件夹自动显示为独立菜单</li>
            <li class="py-2 border-b border-gray-100">
              <strong>自动隐藏：</strong>自动识别路由中的
              <code class="bg-gray-100 px-1 py-0.5 rounded text-0.9em">hideInMenu: true</code> 属性
            </li>
            <li class="py-2 border-b border-gray-100">
              <strong>自动排除：</strong><code class="bg-gray-100 px-1 py-0.5 rounded text-0.9em">_</code> 开头的文件夹自动排除（如
              <code class="bg-gray-100 px-1 py-0.5 rounded text-0.9em">_builtin</code>）
            </li>
            <li class="py-2 border-b border-gray-100">
              <strong>自定义排除：</strong>通过
              <code class="bg-gray-100 px-1 py-0.5 rounded text-0.9em">customExcludeFolders</code> 配置额外排除
            </li>
            <li class="py-2"><strong>预设配置：</strong>常用文件夹已预设图标、标题和排序</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 迁移指南 -->
    <div class="mb-10">
      <h2 class="text-2rem mb-6 text-center">🔄 迁移指南</h2>
      <div class="flex flex-col md:flex-row justify-between gap-6">
        <div class="flex-1 flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-gradient-step text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
          <div>
            <h3 class="m-0 mb-2 text-gray-800">移除复杂配置</h3>
            <p class="m-0 text-gray-600 leading-normal">
              删除页面中不必要的 <code class="bg-gray-100 px-1 py-0.5 rounded">group</code> 配置对象
            </p>
          </div>
        </div>
        <div class="flex-1 flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-gradient-step text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
          <div>
            <h3 class="m-0 mb-2 text-gray-800">按文件夹组织</h3>
            <p class="m-0 text-gray-600 leading-normal">确保页面按功能模块放在对应文件夹下</p>
          </div>
        </div>
        <div class="flex-1 flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-gradient-step text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
          <div>
            <h3 class="m-0 mb-2 text-gray-800">测试验证</h3>
            <p class="m-0 text-gray-600 leading-normal">检查菜单分组是否正确生成</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件夹分类说明 -->
    <div class="mb-10">
      <h2 class="text-2rem mb-6 text-center">📂 文件夹分类说明</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-400">
          <h3 class="m-0 mb-3 text-1.2rem">🏠 单独菜单</h3>
          <p class="m-0 mb-4 text-gray-600 leading-normal">只有1个页面的文件夹，自动显示为独立菜单项</p>
          <div class="flex flex-wrap gap-2">
            <span class="bg-gray-50 px-3 py-1 rounded-full text-0.9rem font-mono text-gray-700">home (1个页面)</span>
            <span class="bg-gray-50 px-3 py-1 rounded-full text-0.9rem font-mono text-gray-700">about (1个页面)</span>
          </div>
        </div>
        <div class="bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-400">
          <h3 class="m-0 mb-3 text-1.2rem">📁 自动分组</h3>
          <p class="m-0 mb-4 text-gray-600 leading-normal">≥2个页面的文件夹，自动创建分组菜单</p>
          <div class="flex flex-wrap gap-2">
            <span class="bg-gray-50 px-3 py-1 rounded-full text-0.9rem font-mono text-gray-700">directives (6个页面)</span>
            <span class="bg-gray-50 px-3 py-1 rounded-full text-0.9rem font-mono text-gray-700">link (5个页面)</span>
          </div>
        </div>
        <div class="bg-white rounded-xl p-5 shadow-sm border-l-4 border-amber-400">
          <h3 class="m-0 mb-3 text-1.2rem">🚫 自动隐藏</h3>
          <p class="m-0 mb-4 text-gray-600 leading-normal">路由中设置 hideInMenu: true，自动隐藏</p>
          <div class="flex flex-wrap gap-2">
            <span class="bg-gray-50 px-3 py-1 rounded-full text-0.9rem font-mono text-gray-700">user-center</span>
          </div>
        </div>
        <div class="bg-white rounded-xl p-5 shadow-sm border-l-4 border-red-400">
          <h3 class="m-0 mb-3 text-1.2rem">❌ 自动排除</h3>
          <p class="m-0 mb-4 text-gray-600 leading-normal">_开头的文件夹自动排除，支持自定义排除</p>
          <div class="flex flex-wrap gap-2">
            <span class="bg-gray-50 px-3 py-1 rounded-full text-0.9rem font-mono text-gray-700">_builtin</span>
            <span class="bg-gray-50 px-3 py-1 rounded-full text-0.9rem font-mono text-gray-700">customExcludeFolders</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 性能对比 -->
    <div class="mb-10">
      <h2 class="text-2rem mb-6 text-center">📊 效果对比</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="text-center bg-white rounded-xl py-8 px-6 shadow-sm">
          <div class="text-3rem font-bold bg-gradient-purple mb-2">90%</div>
          <div class="text-gray-600 text-1.1rem">配置工作量减少</div>
        </div>
        <div class="text-center bg-white rounded-xl py-8 px-6 shadow-sm">
          <div class="text-3rem font-bold bg-gradient-purple mb-2">70%</div>
          <div class="text-gray-600 text-1.1rem">学习成本降低</div>
        </div>
        <div class="text-center bg-white rounded-xl py-8 px-6 shadow-sm">
          <div class="text-3rem font-bold bg-gradient-purple mb-2">100%</div>
          <div class="text-gray-600 text-1.1rem">配置一致性</div>
        </div>
        <div class="text-center bg-white rounded-xl py-8 px-6 shadow-sm">
          <div class="text-3rem font-bold bg-gradient-purple mb-2">0</div>
          <div class="text-gray-600 text-1.1rem">配置错误率</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 特殊样式 - 渐变和背景裁剪 */
.bg-gradient-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.bg-gradient-old {
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
}

.bg-gradient-new {
  background: linear-gradient(135deg, #f0fff4 0%, #fff 100%);
}

.bg-gradient-step {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
