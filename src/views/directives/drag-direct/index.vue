<script setup lang="ts" name="dragDirect">
import { ref } from 'vue'

const dragCount = ref(0)
const isDragging = ref(false)

const handleDragStart = () => {
  isDragging.value = true
  dragCount.value++
}

const handleDragEnd = () => {
  isDragging.value = false
}

const resetCounter = () => {
  dragCount.value = 0
}
</script>

<template>
  <div class="directive-container">
    <NCard class="directive-card" :bordered="false">
      <template #header>
        <div class="card-header">
          <div class="header-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">拖拽指令</h3>
            <p class="header-desc">让元素支持自由拖拽移动</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">🎯 拖拽演示区域</div>

        <div class="drag-area">
          <div class="drag-info">
            <div class="info-item">
              <span class="info-label">拖拽次数:</span>
              <span class="info-value">{{ dragCount }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">状态:</span>
              <span class="info-value" :class="{ dragging: isDragging }">
                {{ isDragging ? '拖拽中' : '静止' }}
              </span>
            </div>
            <NButton @click="resetCounter" size="small" type="default"> 重置计数 </NButton>
          </div>

          <div class="drag-playground">
            <div v-draggable class="drag-box" :class="{ dragging: isDragging }" @mousedown="handleDragStart" @mouseup="handleDragEnd">
              <div class="drag-content">
                <div class="drag-icon">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
                <div class="drag-text">拖我试试</div>
                <div class="drag-hint">{{ isDragging ? '拖拽中...' : '点击拖拽' }}</div>
              </div>
            </div>

            <div class="drag-target">
              <div class="target-content">
                <div class="target-icon">🎯</div>
                <div class="target-text">拖拽目标区域</div>
              </div>
            </div>
          </div>
        </div>

        <div class="usage-tip">
          <div class="tip-icon">💡</div>
          <div class="tip-text">
            <strong>拖拽功能：</strong>通过鼠标按住元素并移动来改变其位置，提供直观的交互体验。
            <br />
            <strong>使用场景：</strong>可拖拽的卡片、弹窗、组件布局、文件上传等交互场景。
            <br />
            <strong>使用方法：</strong>在元素上添加 <code>v-draggable</code> 指令即可实现拖拽功能
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
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
}

.directive-card {
  max-width: 900px;
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
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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

  .drag-area {
    border: 2px dashed #d1d5db;
    border-radius: 16px;
    padding: 24px;
    background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
    position: relative;
    min-height: 400px;

    .drag-info {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 20px;
      padding: 12px 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;

        .info-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .info-value {
          font-size: 14px;
          font-weight: 600;
          color: #374151;

          &.dragging {
            color: #8b5cf6;
          }
        }
      }
    }
  }
}

.drag-playground {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.drag-box {
  position: absolute;
  top: 50px;
  left: 50px;
  width: 120px;
  height: 120px;
  border-radius: 16px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  cursor: move;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
  user-select: none;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
  }

  &.dragging {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 12px 32px rgba(139, 92, 246, 0.5);
    z-index: 10;
  }
}

.drag-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 12px;
  text-align: center;
}

.drag-icon {
  margin-bottom: 8px;
  opacity: 0.9;
}

.drag-text {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.drag-hint {
  font-size: 12px;
  opacity: 0.8;
}

.drag-target {
  position: absolute;
  top: 50px;
  right: 50px;
  width: 140px;
  height: 140px;
  border: 3px dashed #8b5cf6;
  border-radius: 16px;
  background: rgba(139, 92, 246, 0.05);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    border-color: #7c3aed;
  }
}

.target-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.target-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.target-text {
  font-size: 14px;
  color: #8b5cf6;
  font-weight: 500;
}

.usage-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  border-radius: 12px;
  border-left: 4px solid #8b5cf6;
  margin-top: 24px;
}

.tip-icon {
  font-size: 20px;
  line-height: 1;
}

.tip-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: #7c3aed;

  strong {
    color: #6d28d9;
  }

  code {
    background: rgba(109, 40, 217, 0.1);
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

  .drag-area {
    padding: 16px;
    min-height: 300px;
  }

  .drag-info {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .drag-playground {
    height: 200px;
  }

  .drag-box {
    width: 100px;
    height: 100px;
    top: 20px;
    left: 20px;
  }

  .drag-target {
    width: 100px;
    height: 100px;
    top: 20px;
    right: 20px;
  }
}
</style>
