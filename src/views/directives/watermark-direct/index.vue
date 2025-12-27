<script setup lang="ts" name="watermarkDirect">
import { ref } from 'vue'

const watermarkText = ref('frontend-template')
const watermarkOpacity = ref(0.1)
const watermarkSize = ref(16)
const watermarkColor = ref('#000000')
const watermarkAngle = ref(-20)

const presetTexts = ['frontend-template', '机密文档', 'CONFIDENTIAL', '内部资料', 'DRAFT', '版权所有']

const presetColors = [
  { name: '黑色', value: '#000000' },
  { name: '灰色', value: '#666666' },
  { name: '蓝色', value: '#1890ff' },
  { name: '红色', value: '#ff4d4f' },
  { name: '绿色', value: '#52c41a' },
  { name: '紫色', value: '#722ed1' },
]

const currentWatermark = ref({
  text: watermarkText.value,
  opacity: watermarkOpacity.value,
  fontSize: watermarkSize.value,
  color: watermarkColor.value,
  rotate: watermarkAngle.value,
})

const updateWatermark = () => {
  currentWatermark.value = {
    text: watermarkText.value,
    opacity: watermarkOpacity.value,
    fontSize: watermarkSize.value,
    color: watermarkColor.value,
    rotate: watermarkAngle.value,
  }
}

const setPresetText = (text: string) => {
  watermarkText.value = text
  updateWatermark()
}

const setPresetColor = (color: string) => {
  watermarkColor.value = color
  updateWatermark()
}

const resetSettings = () => {
  watermarkText.value = 'frontend-template'
  watermarkOpacity.value = 0.1
  watermarkSize.value = 16
  watermarkColor.value = '#000000'
  watermarkAngle.value = -20
  updateWatermark()
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0'
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">水印指令</h3>
            <p class="header-desc">为页面内容添加防盗用水印保护</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">🛡️ 水印效果演示</div>

        <div class="watermark-controls">
          <div class="control-group">
            <label class="control-label">水印文本</label>
            <div class="text-input-group">
              <NInput v-model:value="watermarkText" placeholder="输入水印文本" @input="updateWatermark" class="text-input" />
              <div class="preset-texts">
                <NButton
                  v-for="text in presetTexts"
                  :key="text"
                  size="small"
                  type="tertiary"
                  @click="setPresetText(text)"
                  class="preset-btn"
                >
                  {{ text }}
                </NButton>
              </div>
            </div>
          </div>

          <div class="control-row">
            <div class="control-group">
              <label class="control-label">透明度: {{ watermarkOpacity }}</label>
              <NSlider v-model:value="watermarkOpacity" :min="0.05" :max="0.5" :step="0.05" @update:value="updateWatermark" />
            </div>

            <div class="control-group">
              <label class="control-label">字体大小: {{ watermarkSize }}px</label>
              <NSlider v-model:value="watermarkSize" :min="12" :max="24" :step="1" @update:value="updateWatermark" />
            </div>
          </div>

          <div class="control-row">
            <div class="control-group">
              <label class="control-label">旋转角度: {{ watermarkAngle }}°</label>
              <NSlider v-model:value="watermarkAngle" :min="-45" :max="45" :step="5" @update:value="updateWatermark" />
            </div>

            <div class="control-group">
              <label class="control-label">颜色选择</label>
              <div class="color-presets">
                <div
                  v-for="color in presetColors"
                  :key="color.value"
                  class="color-preset"
                  :class="{ active: watermarkColor === color.value }"
                  :style="{ backgroundColor: color.value }"
                  @click="setPresetColor(color.value)"
                  :title="color.name"
                ></div>
              </div>
            </div>
          </div>

          <div class="control-actions">
            <NButton @click="resetSettings" type="default">
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
              重置设置
            </NButton>
          </div>
        </div>

        <div class="watermark-demo">
          <div class="demo-area">
            <div
              v-waterMarker="{
                text: currentWatermark.text,
                textColor: `rgba(${hexToRgb(currentWatermark.color)}, ${currentWatermark.opacity})`,
                font: `${currentWatermark.fontSize}px Microsoft JhengHei`,
                rotate: currentWatermark.rotate,
              }"
              class="watermark-container"
            >
              <div class="demo-content">
                <div class="content-header">
                  <h3>📄 示例文档</h3>
                  <div class="document-meta">
                    <span class="meta-item">创建时间: {{ new Date().toLocaleDateString() }}</span>
                    <span class="meta-item">文档类型: 机密</span>
                  </div>
                </div>

                <div class="content-body">
                  <p class="content-paragraph">
                    这是一个带有水印保护的示例文档。水印可以有效防止文档被非法复制和传播， 保护知识产权和敏感信息的安全。
                  </p>

                  <div class="content-list">
                    <h4>水印的主要作用：</h4>
                    <ul>
                      <li>🔒 防止文档被非法复制</li>
                      <li>📋 标识文档来源和版权</li>
                      <li>🛡️ 提供法律保护依据</li>
                      <li>👁️ 增强品牌识别度</li>
                    </ul>
                  </div>

                  <div class="content-highlight">
                    <strong>注意：</strong>水印会自动铺满整个容器区域， 并且会根据容器大小自动调整密度和位置。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="usage-tip">
          <div class="tip-icon">💡</div>
          <div class="tip-text">
            <strong>水印功能：</strong>在指定容器内添加重复的文字水印，用于版权保护和内容标识。
            <br />
            <strong>使用场景：</strong>文档保护、图片版权、敏感信息标识、品牌宣传等需要防盗用的场景。
            <br />
            <strong>使用方法：</strong>在元素上添加
            <code>v-waterMarker="{ text: '水印文本', textColor: 'rgba(180,180,180,0.3)', rotate: -20 }"</code> 指令
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
  background: linear-gradient(135deg, #e0f2fe 0%, #0ea5e9 100%);
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
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
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
}

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

.demo-section {
  padding: 24px 0;
}

.demo-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.watermark-controls {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 2px solid #0ea5e9;
}

.control-group {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.control-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #0c4a6e;
  margin-bottom: 8px;
}

.text-input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.text-input {
  max-width: 300px;
}

.preset-texts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-btn {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
}

.control-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 20px;
}

.color-presets {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-preset {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &.active {
    border-color: #0ea5e9;
    transform: scale(1.1);
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.3);
  }
}

.control-actions {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #e0f2fe;
}

.watermark-demo {
  margin-bottom: 24px;
}

.demo-area {
  display: flex;
  justify-content: center;
}

.watermark-container {
  width: 100%;
  max-width: 600px;
  height: 400px;
  border-radius: 12px;
  border: 2px solid #0ea5e9;
  overflow: hidden;
  position: relative;
}

.demo-content {
  padding: 24px;
  height: 100%;
  background: transparent;
  overflow-y: auto;
}

.content-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e0f2fe;

  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #0c4a6e;
    margin: 0 0 8px 0;
  }
}

.document-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 12px;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
}

.content-body {
  line-height: 1.6;
}

.content-paragraph {
  font-size: 14px;
  color: #475569;
  margin-bottom: 20px;
  text-align: justify;
}

.content-list {
  margin-bottom: 20px;

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #0c4a6e;
    margin: 0 0 12px 0;
  }

  ul {
    margin: 0;
    padding-left: 20px;

    li {
      font-size: 14px;
      color: #475569;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.content-highlight {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-left: 4px solid #f59e0b;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #92400e;

  strong {
    color: #78350f;
  }
}

.usage-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border-left: 4px solid #0ea5e9;
}

.tip-icon {
  font-size: 20px;
  line-height: 1;
}

.tip-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: #0284c7;

  strong {
    color: #0c4a6e;
  }

  code {
    background: rgba(12, 74, 110, 0.1);
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

  .control-row {
    grid-template-columns: 1fr;
  }

  .watermark-container {
    height: 300px;
  }

  .demo-content {
    padding: 16px;
  }

  .document-meta {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
