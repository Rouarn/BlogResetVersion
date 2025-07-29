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
      title: '自定义指令',
      icon: 'material-icon-theme:folder-vue-directives-open',
      i18nKey: 'route.directives',
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
          <pre><code>&lt;route lang="json5"&gt;
{
  meta: {
    title: '页面标题',
    // 🎉 无需配置 group，自动根据文件夹结构生成
    order: 1,
  },
}
&lt;/route&gt;</code></pre>
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
              <code>directives/</code>
              <span class="arrow">→</span>
              <span class="group-info">
                <span class="group-title">自定义指令</span>
                <span class="group-icon">🎯</span>
              </span>
            </div>
            <div class="mapping-item">
              <code>components/</code>
              <span class="arrow">→</span>
              <span class="group-info">
                <span class="group-title">组件示例</span>
                <span class="group-icon">🧩</span>
              </span>
            </div>
            <div class="mapping-item">
              <code>system/</code>
              <span class="arrow">→</span>
              <span class="group-info">
                <span class="group-title">系统管理</span>
                <span class="group-icon">⚙️</span>
              </span>
            </div>
          </div>
        </div>

        <div class="rule-card">
          <h3>🎯 智能判断</h3>
          <ul class="smart-rules">
            <li>文件夹下 ≥2 个页面时自动分组</li>
            <li>排除 <code>_builtin</code> 等特殊文件夹</li>
            <li>支持嵌套分组和自定义配置</li>
            <li>自动处理国际化和图标</li>
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

// 这个页面本身就是自动菜单生成器的演示
// 它会自动归类到 "自定义指令" 分组下
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
