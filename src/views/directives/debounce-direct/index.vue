<script setup lang="ts" name="debounceDirect">
import { ref } from 'vue'

const clickCount = ref(0)
const executeCount = ref(0)
const isWaiting = ref(false)

const debounceClick = () => {
  executeCount.value++
  isWaiting.value = false
  window.$message?.success(`防抖执行成功！第 ${executeCount.value} 次执行 🎉`)
}

const handleClick = () => {
  clickCount.value++
  isWaiting.value = true

  // 模拟防抖等待状态
  setTimeout(() => {
    if (isWaiting.value) {
      isWaiting.value = false
    }
  }, 500)
}

const resetCounters = () => {
  clickCount.value = 0
  executeCount.value = 0
  isWaiting.value = false
}
</script>

<template>
  <div class="directive-container">
    <NCard class="directive-card" :bordered="false">
      <template #header>
        <div class="card-header">
          <div class="header-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">防抖指令</h3>
            <p class="header-desc">防止函数频繁调用，提升性能体验</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">⏱️ 防抖效果演示</div>

        <div class="stats-grid">
          <div class="stat-card click-stat">
            <div class="stat-number">{{ clickCount }}</div>
            <div class="stat-label">点击次数</div>
          </div>
          <div class="stat-card execute-stat">
            <div class="stat-number">{{ executeCount }}</div>
            <div class="stat-label">实际执行</div>
          </div>
        </div>

        <div class="button-group">
          <NButton
            v-debounce="debounceClick"
            type="primary"
            size="large"
            class="debounce-btn"
            :class="{ waiting: isWaiting }"
            @click="handleClick"
          >
            <template #icon>
              <div class="btn-icon" :class="{ spinning: isWaiting }">
                <svg v-if="!isWaiting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </template>
            {{ isWaiting ? '等待中...' : '防抖按钮 (500ms)' }}
          </NButton>

          <NButton @click="resetCounters" type="default" size="large" class="reset-btn">
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </template>
            重置计数
          </NButton>
        </div>

        <div class="usage-tip">
          <div class="tip-icon">💡</div>
          <div class="tip-text">
            <strong>防抖原理：</strong>在事件被触发后延迟执行，如果在延迟期间再次触发，则重新计时。
            <br />
            <strong>使用场景：</strong>搜索输入、按钮点击、窗口调整等需要防止频繁操作的场景。
            <br />
            <strong>使用方法：</strong>在元素上添加 <code>v-debounce="handler"</code> 指令
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped lang="scss">
.directive-container {
  padding: 24px;
  min-height: calc(100vh - 200px);
  background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
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

  .header-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%);
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
}

.demo-section {
  padding: 24px 0;

  .demo-title {
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;

    .stat-card {
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      transition: all 0.3s ease;

      &.click-stat {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border: 2px solid #f59e0b;

        .stat-number {
          color: #92400e;
        }

        .stat-label {
          color: #78350f;
        }
      }

      &.execute-stat {
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
        border: 2px solid #10b981;

        .stat-number {
          color: #065f46;
        }

        .stat-label {
          color: #064e3b;
        }
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }

      .stat-number {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

.button-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.debounce-btn {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;

  &.waiting {
    background: #f59e0b !important;
    border-color: #f59e0b !important;

    &:hover {
      background: #d97706 !important;
    }
  }
}

.reset-btn {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
}

.btn-icon {
  transition: transform 0.3s ease;

  &.spinning {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.usage-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
  border-radius: 12px;
  border-left: 4px solid #0288d1;
}

.tip-icon {
  font-size: 20px;
  line-height: 1;
}

.tip-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: #0277bd;

  strong {
    color: #01579b;
  }

  code {
    background: rgba(1, 87, 155, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 13px;
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

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .button-group {
    flex-direction: column;
    align-items: center;
  }
}
</style>
