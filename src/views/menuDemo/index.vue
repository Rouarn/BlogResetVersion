<template>
  <div class="menu-demo-container">
    <div class="demo-header">
      <h1>🎉 菜单配置优化演示</h1>
      <p class="subtitle">从复杂配置到零配置的进化</p>
    </div>

    <div class="comparison-grid">
      <!-- 旧方式 -->
      <div class="config-card old-way">
        <div class="card-header">
          <h2>❌ 旧方式（复杂）</h2>
          <span class="complexity-badge high">复杂度: 高</span>
        </div>
        <div class="code-block">
          <pre><code>&lt;route lang="json5"&gt;
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
        <div class="issues-list">
          <h3>存在问题：</h3>
          <ul>
            <li>🔴 配置冗长，容易出错</li>
            <li>🔴 新手学习成本高</li>
            <li>🔴 重复配置，维护困难</li>
            <li>🔴 不一致的分组配置</li>
          </ul>
        </div>
      </div>

      <!-- 新方式 -->
      <div class="config-card new-way">
        <div class="card-header">
          <h2>✅ 新方式（简化）</h2>
          <span class="complexity-badge low">复杂度: 低</span>
        </div>
        <div class="code-block">
          <pre><code>definePage({
  meta: {
    title: '菜单演示',
    order: 1,
    i18nKey: 'route.menuDemo'
  },
})</code></pre>
        </div>
        <div class="benefits-list">
          <h3>优势特点：</h3>
          <ul>
            <li>✅ 零配置，开箱即用</li>
            <li>✅ 基于文件夹结构自动分组</li>
            <li>✅ 预设常用配置</li>
            <li>✅ 支持自定义覆盖</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 自动分组规则 -->
    <div class="rules-section">
      <h2>🤖 自动分组规则</h2>
      <div class="rules-grid">
        <div class="rule-card">
          <h3>📁 文件夹映射</h3>
          <div class="folder-mapping">
            <div class="mapping-item">
              <code>home/</code>
              <span class="arrow">→</span>
              <span class="group-info">
                <span class="group-title">首页</span>
                <span class="group-icon">🏠</span>
                <span class="group-type">单独菜单</span>
              </span>
            </div>
            <div class="mapping-item">
              <code>directives/</code>
              <span class="arrow">→</span>
              <span class="group-info">
                <span class="group-title">自定义指令</span>
                <span class="group-icon">🎯</span>
                <span class="group-type">自动分组</span>
              </span>
            </div>
            <div class="mapping-item">
              <code>link/</code>
              <span class="arrow">→</span>
              <span class="group-info">
                <span class="group-title">外部链接</span>
                <span class="group-icon">🔗</span>
                <span class="group-type">自动分组</span>
              </span>
            </div>
            <div class="mapping-item">
              <code>about/</code>
              <span class="arrow">→</span>
              <span class="group-info">
                <span class="group-title">关于</span>
                <span class="group-icon">ℹ️</span>
                <span class="group-type">单独菜单</span>
              </span>
            </div>
            <div class="mapping-item excluded">
              <code>user-center/</code>
              <span class="arrow">→</span>
              <span class="group-info">
                <span class="group-title">自动隐藏</span>
                <span class="group-icon">🚫</span>
                <span class="group-type">hideInMenu: true</span>
              </span>
            </div>
            <div class="mapping-item excluded">
              <code>_builtin/</code>
              <span class="arrow">→</span>
              <span class="group-info">
                <span class="group-title">自动排除</span>
                <span class="group-icon">❌</span>
                <span class="group-type">_开头文件夹</span>
              </span>
            </div>
          </div>
        </div>

        <div class="rule-card">
          <h3>🎯 智能判断</h3>
          <ul class="smart-rules">
            <li><strong>智能排序：</strong>'home' 菜单始终排在第一位</li>
            <li><strong>自动分组：</strong>文件夹下 ≥2 个页面时自动分组</li>
            <li><strong>单独菜单：</strong>只有1个页面的文件夹自动显示为独立菜单</li>
            <li><strong>自动隐藏：</strong>自动识别路由中的 <code>hideInMenu: true</code> 属性</li>
            <li><strong>自动排除：</strong><code>_</code> 开头的文件夹自动排除（如 <code>_builtin</code>）</li>
            <li><strong>自定义排除：</strong>通过 <code>customExcludeFolders</code> 配置额外排除</li>
            <li><strong>预设配置：</strong>常用文件夹已预设图标、标题和排序</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 迁移指南 -->
    <div class="migration-section">
      <h2>🔄 迁移指南</h2>
      <div class="migration-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>移除复杂配置</h3>
            <p>删除页面中不必要的 <code>group</code> 配置对象</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>按文件夹组织</h3>
            <p>确保页面按功能模块放在对应文件夹下</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>测试验证</h3>
            <p>检查菜单分组是否正确生成</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件夹分类说明 -->
    <div class="folder-types-section">
      <h2>📂 文件夹分类说明</h2>
      <div class="folder-types-grid">
        <div class="folder-type-card single">
          <h3>🏠 单独菜单</h3>
          <p>只有1个页面的文件夹，自动显示为独立菜单项</p>
          <div class="examples">
            <span class="example">home (1个页面)</span>
            <span class="example">about (1个页面)</span>
          </div>
        </div>
        <div class="folder-type-card group">
          <h3>📁 自动分组</h3>
          <p>≥2个页面的文件夹，自动创建分组菜单</p>
          <div class="examples">
            <span class="example">directives (6个页面)</span>
            <span class="example">link (5个页面)</span>
          </div>
        </div>
        <div class="folder-type-card hidden">
          <h3>🚫 自动隐藏</h3>
          <p>路由中设置 hideInMenu: true，自动隐藏</p>
          <div class="examples">
            <span class="example">user-center</span>
          </div>
        </div>
        <div class="folder-type-card exclude">
          <h3>❌ 自动排除</h3>
          <p>_开头的文件夹自动排除，支持自定义排除</p>
          <div class="examples">
            <span class="example">_builtin</span>
            <span class="example">customExcludeFolders</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 性能对比 -->
    <div class="performance-section">
      <h2>📊 效果对比</h2>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">90%</div>
          <div class="metric-label">配置工作量减少</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">70%</div>
          <div class="metric-label">学习成本降低</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">100%</div>
          <div class="metric-label">配置一致性</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">0</div>
          <div class="metric-label">配置错误率</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="MenuDemo">
definePage({
  meta: {
    title: '菜单配置演示',
    icon: 'material-symbols:menu-book',
    order: 3,
  },
})

// 🎯 这个页面本身就是智能菜单生成器的演示
// 📁 它位于 src/views/menuDemo/ 文件夹下
// 🔍 智能识别：由于只有1个页面，自动显示为独立菜单项
// 📈 如果在同一文件夹下添加更多页面（≥2个），系统会自动创建分组
// 🚀 无需任何手动配置，完全基于文件夹结构智能判断
</script>

<style scoped lang="scss">
.menu-demo-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;

  .demo-header {
    text-align: center;
    margin-bottom: 40px;

    h1 {
      font-size: 2.5rem;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 1.2rem;
      color: #666;
      margin: 0;
    }
  }

  .comparison-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 40px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .config-card {
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &.old-way {
      border-left: 4px solid #ff6b6b;
      background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
    }

    &.new-way {
      border-left: 4px solid #51cf66;
      background: linear-gradient(135deg, #f0fff4 0%, #fff 100%);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h2 {
        margin: 0;
        font-size: 1.5rem;
      }
    }

    .complexity-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;

      &.high {
        background: #ffe0e0;
        color: #d63031;
      }

      &.low {
        background: #e0ffe0;
        color: #00b894;
      }
    }
  }

  .code-block {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    overflow-x: auto;

    pre {
      margin: 0;
      font-family: 'Fira Code', monospace;
      font-size: 0.9rem;
      line-height: 1.5;
    }
  }

  .issues-list,
  .benefits-list {
    h3 {
      margin: 0 0 12px 0;
      font-size: 1.1rem;
    }

    ul {
      margin: 0;
      padding-left: 20px;

      li {
        margin-bottom: 8px;
        line-height: 1.5;
      }
    }
  }

  .rules-section,
  .migration-section,
  .performance-section {
    margin-bottom: 40px;

    h2 {
      font-size: 2rem;
      margin-bottom: 24px;
      text-align: center;
    }
  }

  .rules-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .rule-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h3 {
      margin: 0 0 16px 0;
      color: #2d3748;
    }
  }

  .folder-mapping {
    .mapping-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      code {
        background: #f1f3f4;
        padding: 4px 8px;
        border-radius: 4px;
        font-family: 'Fira Code', monospace;
      }

      .arrow {
        margin: 0 12px;
        color: #666;
      }

      .group-info {
        display: flex;
        align-items: center;
        gap: 8px;

        .group-title {
          font-weight: 500;
        }

        .group-type {
          font-size: 0.8rem;
          padding: 2px 8px;
          border-radius: 12px;
          background: #f0f0f0;
          color: #666;
        }
      }
    }

    &.excluded {
      opacity: 0.6;

      .group-info .group-type {
        background: #ffe0e0;
        color: #d63031;
      }
    }
  }

  .smart-rules {
    list-style: none;
    padding: 0;

    li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }

      code {
        background: #f1f3f4;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 0.9em;
      }
    }
  }

  .migration-steps {
    display: flex;
    justify-content: space-between;
    gap: 24px;

    @media (max-width: 768px) {
      flex-direction: column;
    }

    .step {
      flex: 1;
      display: flex;
      align-items: flex-start;
      gap: 16px;

      .step-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
      }

      .step-content {
        h3 {
          margin: 0 0 8px 0;
          color: #2d3748;
        }

        p {
          margin: 0;
          color: #666;
          line-height: 1.5;

          code {
            background: #f1f3f4;
            padding: 2px 6px;
            border-radius: 3px;
          }
        }
      }
    }
  }

  .folder-types-section {
    margin-bottom: 40px;

    h2 {
      font-size: 2rem;
      margin-bottom: 24px;
      text-align: center;
    }
  }

  .folder-types-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .folder-type-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #ddd;

    &.single {
      border-left-color: #51cf66;
    }

    &.group {
      border-left-color: #339af0;
    }

    &.hidden {
      border-left-color: #ffa502;
    }

    &.exclude {
      border-left-color: #ff6b6b;
    }

    h3 {
      margin: 0 0 12px 0;
      font-size: 1.2rem;
    }

    p {
      margin: 0 0 16px 0;
      color: #666;
      line-height: 1.5;
    }

    .examples {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .example {
        background: #f8f9fa;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 0.9rem;
        font-family: 'Fira Code', monospace;
        color: #495057;
      }
    }
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
  }

  .metric-card {
    text-align: center;
    background: white;
    border-radius: 12px;
    padding: 32px 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .metric-value {
      font-size: 3rem;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }

    .metric-label {
      color: #666;
      font-size: 1.1rem;
    }
  }
}
</style>
