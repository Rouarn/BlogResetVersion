<script setup lang="ts" name="copyDirect">
import { ref } from 'vue'

const data = ref<string>('我是被复制的内容 🍒 🍉 🍊')
const copySuccess = ref(false)

const handleCopy = () => {
  copySuccess.value = true
  setTimeout(() => {
    copySuccess.value = false
  }, 2000)
}
</script>

<template>
  <div class="directive-container">
    <NCard class="directive-card" :bordered="false">
      <template #header>
        <div class="card-header">
          <div class="header-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">复制指令</h3>
            <p class="header-desc">一键复制文本内容到剪贴板</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">📋 试试复制功能</div>
        <div class="input-group">
          <NInput v-model:value="data" placeholder="请输入要复制的内容" class="copy-input" size="large" />
          <NButton v-copy="data" type="primary" size="medium" class="copy-btn" :class="{ 'copy-success': copySuccess }" @click="handleCopy">
            <template #icon>
              <svg v-if="!copySuccess" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </template>
            {{ copySuccess ? '已复制' : '复制' }}
          </NButton>
        </div>

        <div class="usage-tip">
          <div class="tip-icon">💡</div>
          <div class="tip-text"><strong>使用方法：</strong>在任意元素上添加 <code>v-copy="content"</code> 指令即可实现一键复制功能</div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped lang="scss">
.directive-container {
  padding: 24px;
  min-height: calc(100vh - 200px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.directive-card {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  svg {
    width: 24px;
    height: 24px;
  }
}

.header-content {
  flex: 1;

  .header-title {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 4px 0;
  }

  .header-desc {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }
}

.demo-section {
  padding: 24px 0;

  .demo-title {
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .input-group {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;

    .copy-input {
      :deep(.n-input) {
        border-radius: 12px;
        border: 2px solid #e5e7eb;
        transition: all 0.3s ease;

        &:hover {
          border-color: #d1d5db;
        }

        &:focus-within {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
      }
    }

    .copy-btn {
      border-radius: 8px;
      transition: all 0.3s ease;

      &.copy-success {
        background: #10b981 !important;
        border-color: #10b981 !important;

        &:hover {
          background: #059669 !important;
        }
      }
    }
  }
}

.usage-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  border-left: 4px solid #f59e0b;

  .tip-icon {
    font-size: 20px;
    line-height: 1;
  }

  .tip-text {
    flex: 1;
    font-size: 14px;
    line-height: 1.5;
    color: #92400e;

    strong {
      color: #78350f;
    }

    code {
      background: rgba(120, 53, 15, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 13px;
    }
  }
}

@media (max-width: 768px) {
  .directive-container {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .copy-input {
    :deep(.n-input) {
      font-size: 16px;
    }
  }
}
</style>
