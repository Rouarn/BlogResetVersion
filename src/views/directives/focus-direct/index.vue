<script setup lang="ts" name="focusDirect">
import { ref } from 'vue'

const focusEnabled = ref(true)
const inputValue = ref('')
const conditionalValue = ref('')
</script>

<template>
  <div class="directive-container">
    <NCard class="directive-card" :bordered="false">
      <template #header>
        <div class="card-header">
          <div class="header-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">聚焦指令</h3>
            <p class="header-desc">自动聚焦到指定的输入元素</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">🎯 基础用法</div>
        <div class="demo-content">
          <p class="demo-desc">页面加载时自动聚焦到输入框</p>
          <NInput v-focus v-model:value="inputValue" placeholder="页面加载时自动聚焦" size="large" class="focus-input" />
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">⚙️ 条件聚焦</div>
        <div class="demo-content">
          <p class="demo-desc">根据条件决定是否聚焦</p>
          <div class="control-group">
            <NSpace align="center">
              <NSwitch v-model:value="focusEnabled" />
              <span>启用聚焦</span>
            </NSpace>
          </div>
          <NInput
            v-focus="focusEnabled"
            v-model:value="conditionalValue"
            placeholder="根据开关状态决定是否聚焦"
            size="large"
            class="focus-input"
          />
        </div>
      </div>

      <div class="code-section">
        <div class="code-title">💻 使用示例</div>
        <div class="code-content">
          <pre><code>&lt;!-- 基础用法 --&gt;
&lt;input v-focus /&gt;

&lt;!-- 条件聚焦 --&gt;
&lt;input v-focus="isEnabled" /&gt;

&lt;!-- 在 Vue 组件中 --&gt;
&lt;NInput v-focus placeholder="自动聚焦" /&gt;</code></pre>
        </div>
      </div>

      <div class="feature-section">
        <div class="feature-title">✨ 功能特点</div>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <div class="feature-content">
              <h4>自动聚焦</h4>
              <p>元素挂载时自动获得焦点</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <div class="feature-content">
              <h4>条件控制</h4>
              <p>支持动态控制是否聚焦</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔄</div>
            <div class="feature-content">
              <h4>响应式更新</h4>
              <p>条件变化时自动重新聚焦</p>
            </div>
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped lang="scss">
.directive-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.directive-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;

  .header-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .header-content {
    flex: 1;

    .header-title {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #1a1a1a;
    }

    .header-desc {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }
}

.demo-section {
  margin-bottom: 32px;

  .demo-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  }

  .demo-content {
    background: #f8fafc;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;

    .demo-desc {
      margin: 0 0 16px 0;
      color: #64748b;
      font-size: 14px;
    }
  }

  .focus-input {
    margin-bottom: 16px;
  }

  .control-group {
    margin-bottom: 16px;
  }
}

.code-section {
  margin-bottom: 32px;

  .code-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  }

  .code-content {
    background: #1e293b;
    color: #e2e8f0;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;

    pre {
      margin: 0;
      font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
      font-size: 14px;
      line-height: 1.5;
    }
  }
}

.feature-section {
  margin-bottom: 32px;

  .feature-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  }

  .feature-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;

      .feature-icon {
        font-size: 24px;
        flex-shrink: 0;
      }

      .feature-content {
        h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
}
</style>
