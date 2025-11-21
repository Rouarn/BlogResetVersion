<script setup lang="ts" name="scrollDirect">
import { ref } from 'vue'

const scrollDirection = ref('vertical')
const scrollSpeed = ref(50)
const scrollThreshold = ref(100)
const autoScroll = ref(false)
const smoothScroll = ref(true)
const showScrollbar = ref(true)

const scrollStats = ref({
  position: 0,
  percentage: 0,
  direction: 'none',
  velocity: 0,
})

// 添加调试信息状态
const debugInfo = ref<string>('')
const showDebugInfo = ref(false)

const scrollToTop = () => {
  const element = document.querySelector('.scroll-container')
  if (element) {
    element.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const scrollToBottom = () => {
  const element = document.querySelector('.scroll-container')
  if (element) {
    element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' })
  }
}

const scrollToPosition = (percentage: number) => {
  const element = document.querySelector('.scroll-container')
  if (element) {
    // 根据百分比计算实际位置
    const maxScrollHeight = element.scrollHeight - element.clientHeight
    const targetPosition = (maxScrollHeight * percentage) / 100
    element.scrollTo({ top: targetPosition, behavior: 'smooth' })
  }
}

// 为滚动控制区域添加单独的函数
const scrollControlToPosition = (percentage: number) => {
  const element = document.querySelector('.control-scroll-container')
  if (element) {
    // 根据百分比计算实际位置
    const maxScrollHeight = element.scrollHeight - element.clientHeight
    const targetPosition = (maxScrollHeight * percentage) / 100
    console.log(`滚动控制导航: ${percentage}% -> ${Math.round(targetPosition)}px (最大滚动高度: ${maxScrollHeight}px)`)
    element.scrollTo({ top: targetPosition, behavior: 'smooth' })
  }
}

// 添加调试函数，显示容器信息
const showContainerInfo = () => {
  const basicContainer = document.querySelector('.scroll-container')
  const controlContainer = document.querySelector('.control-scroll-container')

  let debugText = '🔍 滚动容器调试信息\n\n'

  if (basicContainer) {
    const basicInfo = {
      clientHeight: basicContainer.clientHeight,
      scrollHeight: basicContainer.scrollHeight,
      maxScroll: basicContainer.scrollHeight - basicContainer.clientHeight,
      currentScroll: basicContainer.scrollTop,
      currentPercentage: Math.round((basicContainer.scrollTop / (basicContainer.scrollHeight - basicContainer.clientHeight)) * 100) || 0,
    }

    debugText += '📊 基础滚动容器:\n'
    debugText += `• 可视高度: ${basicInfo.clientHeight}px\n`
    debugText += `• 内容总高度: ${basicInfo.scrollHeight}px\n`
    debugText += `• 最大可滚动距离: ${basicInfo.maxScroll}px\n`
    debugText += `• 当前滚动位置: ${basicInfo.currentScroll}px\n`
    debugText += `• 当前滚动百分比: ${basicInfo.currentPercentage}%\n\n`

    console.log('基础滚动容器信息:', basicInfo)
  }

  if (controlContainer) {
    const controlInfo = {
      clientHeight: controlContainer.clientHeight,
      scrollHeight: controlContainer.scrollHeight,
      maxScroll: controlContainer.scrollHeight - controlContainer.clientHeight,
      currentScroll: controlContainer.scrollTop,
      currentPercentage:
        Math.round((controlContainer.scrollTop / (controlContainer.scrollHeight - controlContainer.clientHeight)) * 100) || 0,
    }

    debugText += '🎮 控制滚动容器:\n'
    debugText += `• 可视高度: ${controlInfo.clientHeight}px\n`
    debugText += `• 内容总高度: ${controlInfo.scrollHeight}px\n`
    debugText += `• 最大可滚动距离: ${controlInfo.maxScroll}px\n`
    debugText += `• 当前滚动位置: ${controlInfo.currentScroll}px\n`
    debugText += `• 当前滚动百分比: ${controlInfo.currentPercentage}%\n\n`

    console.log('控制滚动容器信息:', controlInfo)
  }

  debugText += '💡 调试说明:\n'
  debugText += '• 滚动百分比计算：(当前位置 / 最大可滚动距离) × 100%\n'
  debugText += '• 如果定位不准确，检查目标位置计算是否正确\n'
  debugText += '• 查看控制台获取更详细的技术信息'

  debugInfo.value = debugText
  showDebugInfo.value = true

  console.log('🔍 调试信息已显示在页面上')
}

interface ScrollData {
  position: number
  percentage: number
  direction: string
  velocity: number
}

const onScrollUpdate = (data: ScrollData) => {
  scrollStats.value = data
}

const resetScroll = () => {
  scrollStats.value = {
    position: 0,
    percentage: 0,
    direction: 'none',
    velocity: 0,
  }
}
</script>

<template>
  <div class="directive-container">
    <NCard class="directive-card" :bordered="false">
      <template #header>
        <div class="card-header">
          <div class="header-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7l4-4m0 0l4 4m-4-4v18" />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">滚动指令</h3>
            <p class="header-desc">增强滚动体验，提供滚动监听、控制和优化功能</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">⚙️ 滚动配置</div>
        <div class="demo-content">
          <div class="config-controls">
            <div class="control-row">
              <div class="control-group">
                <label class="control-label">滚动方向:</label>
                <NRadioGroup v-model:value="scrollDirection">
                  <NRadio value="vertical">垂直</NRadio>
                  <NRadio value="horizontal">水平</NRadio>
                  <NRadio value="both">双向</NRadio>
                </NRadioGroup>
              </div>

              <div class="control-group">
                <label class="control-label">滚动速度: {{ scrollSpeed }}px/s</label>
                <NSlider v-model:value="scrollSpeed" :min="10" :max="200" :step="10" class="speed-slider" />
              </div>
            </div>

            <div class="control-row">
              <div class="control-group">
                <label class="control-label">滚动阈值: {{ scrollThreshold }}px</label>
                <NSlider v-model:value="scrollThreshold" :min="10" :max="500" :step="10" class="threshold-slider" />
              </div>

              <div class="control-group">
                <label class="control-label">滚动选项:</label>
                <div class="checkbox-group">
                  <NCheckbox v-model:checked="autoScroll">自动滚动</NCheckbox>
                  <NCheckbox v-model:checked="smoothScroll">平滑滚动</NCheckbox>
                  <NCheckbox v-model:checked="showScrollbar">显示滚动条</NCheckbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">📊 滚动状态</div>
        <div class="demo-content">
          <div class="scroll-stats">
            <div class="stat-item">
              <div class="stat-label">滚动位置</div>
              <div class="stat-value">{{ Math.round(scrollStats.position) }}px</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">滚动百分比</div>
              <div class="stat-value">{{ Math.round(scrollStats.percentage) }}%</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">滚动方向</div>
              <div class="stat-value">{{ scrollStats.direction }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">滚动速度</div>
              <div class="stat-value">{{ Math.round(scrollStats.velocity) }}px/s</div>
            </div>
          </div>

          <div class="scroll-progress">
            <div class="progress-label">滚动进度</div>
            <NProgress type="line" :percentage="scrollStats.percentage" :show-indicator="true" status="success" />
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">🎯 基础滚动演示</div>
        <div class="demo-content">
          <p class="demo-desc">在下方容器中滚动查看滚动监听效果</p>
          <div class="auto-scroll-tip" v-if="autoScroll">
            <div class="tip-icon">🔄</div>
            <div class="tip-text"><strong>自动滚动已启用！</strong>容器正在以 {{ scrollSpeed }}px/s 的速度自动滚动</div>
          </div>
          <div class="scroll-demo">
            <div class="scroll-controls">
              <NButton size="small" @click="scrollToTop">滚动到顶部</NButton>
              <NButton size="small" @click="scrollToPosition(50)">滚动到中间</NButton>
              <NButton size="small" @click="scrollToBottom">滚动到底部</NButton>
              <NButton size="small" @click="resetScroll">重置状态</NButton>
              <NButton size="small" type="info" @click="showContainerInfo">显示容器信息</NButton>
            </div>

            <!-- 调试信息显示区域 -->
            <div v-if="showDebugInfo" class="debug-info-panel">
              <div class="debug-header">
                <span class="debug-title">🔍 调试信息</span>
                <NButton size="small" text @click="showDebugInfo = false">✕ 关闭</NButton>
              </div>
              <pre class="debug-content">{{ debugInfo }}</pre>
            </div>

            <div
              v-scroll="{
                direction: scrollDirection,
                threshold: scrollThreshold,
                smooth: smoothScroll,
                showScrollbar: showScrollbar,
                autoScroll: autoScroll,
                autoScrollSpeed: scrollSpeed,
                onScroll: onScrollUpdate,
              }"
              class="scroll-container"
              :class="{ 'hide-scrollbar': !showScrollbar }"
            >
              <div class="scroll-content">
                <div class="content-section" style="background: #e3f2fd">
                  <h3>第一部分</h3>
                  <p>这是滚动容器的第一部分内容。当你滚动时，指令会监听滚动事件并更新状态信息。</p>
                  <div class="content-items">
                    <div class="content-item" v-for="i in 5" :key="i">
                      <div class="content-icon">📝</div>
                      <div class="item-text">内容项 {{ i }}</div>
                    </div>
                  </div>
                </div>

                <div class="content-section" style="background: #f3e5f5">
                  <h3>第二部分</h3>
                  <p>继续滚动查看更多内容。滚动指令会实时计算滚动位置、百分比和滚动方向。</p>
                  <div class="content-grid">
                    <div class="grid-item" v-for="i in 8" :key="i">
                      <div class="content-grid-icon">🎨</div>
                      <div class="grid-title">项目 {{ i }}</div>
                      <div class="grid-desc">这是项目 {{ i }} 的描述</div>
                    </div>
                  </div>
                </div>

                <div class="content-section" style="background: #e8f5e8">
                  <h3>第三部分</h3>
                  <p>滚动指令还可以检测滚动速度，为你提供完整的滚动体验数据。</p>
                  <div class="content-list">
                    <div class="list-item" v-for="i in 10" :key="i">
                      <div class="list-number">{{ i }}</div>
                      <div class="list-content">
                        <h4>列表项 {{ i }}</h4>
                        <p>这是列表项 {{ i }} 的详细内容描述</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="content-section" style="background: #fff3e0">
                  <h3>第四部分</h3>
                  <p>最后一部分内容。滚动到这里表示你已经浏览了所有内容。</p>
                  <div class="final-content">
                    <div class="final-icon">🎉</div>
                    <div class="final-text">
                      <h4>恭喜！</h4>
                      <p>你已经完成了滚动演示的浏览</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">🔄 水平滚动演示</div>
        <div class="demo-content">
          <p class="demo-desc">水平滚动容器演示 - 支持鼠标滚轮水平滚动</p>
          <div class="scroll-tip">
            <div class="tip-icon">💡</div>
            <div class="tip-text">
              <strong>水平滚动操作方式：</strong>
              <br />• 鼠标滚轮：直接滚动鼠标滚轮即可水平滚动 <br />• 拖拽滚动条：点击拖拽底部滚动条 <br />• 双向滚动模式：按住 Shift +
              滚轮可水平滚动
            </div>
          </div>
          <div class="horizontal-scroll-demo">
            <div
              v-scroll="{
                direction: 'horizontal',
                threshold: 50,
                smooth: true,
                wheelHorizontal: true,
                onScroll: onScrollUpdate,
              }"
              class="horizontal-scroll-container"
            >
              <div class="horizontal-content">
                <div class="horizontal-item" v-for="i in 15" :key="i">
                  <div class="item-header">
                    <div class="item-avatar">{{ String.fromCharCode(65 + ((i - 1) % 26)) }}</div>
                    <div class="item-title">卡片 {{ i }}</div>
                  </div>
                  <div class="item-body">
                    <p>这是第 {{ i }} 个水平滚动卡片</p>
                    <div class="item-tags">
                      <span class="tag">标签{{ i }}</span>
                      <span class="tag">类型{{ (i % 3) + 1 }}</span>
                    </div>
                  </div>
                  <div class="item-footer">
                    <button class="item-button">查看详情</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">🎪 滚动触发动画</div>
        <div class="demo-content">
          <p class="demo-desc">结合滚动位置触发的动画效果</p>
          <div class="scroll-animation-demo">
            <div
              v-scroll="{
                direction: 'vertical',
                threshold: 100,
                onScroll: onScrollUpdate,
                onEnter: (el: { classList: { add: (arg0: string) => any } }) => el.classList.add('animate-in'),
                onLeave: (el: { classList: { remove: (arg0: string) => any } }) => el.classList.remove('animate-in'),
              }"
              class="animation-scroll-container"
            >
              <div class="animation-content">
                <div class="animation-section" v-for="i in 6" :key="i">
                  <div class="section-content">
                    <div class="section-icon">{{ ['🚀', '⚡', '🎯', '💡', '🔥', '✨'][i - 1] }}</div>
                    <div class="section-text">
                      <h4>动画区域 {{ i }}</h4>
                      <p>当滚动到这个区域时会触发进入动画</p>
                    </div>
                  </div>
                  <div class="section-progress">
                    <div
                      class="progress-bar"
                      :style="{ width: `${Math.min(100, Math.max(0, (scrollStats.percentage - (i - 1) * 16.67) * 6))}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">🎮 滚动控制</div>
        <div class="demo-content">
          <p class="demo-desc">程序化控制滚动行为</p>
          <div class="scroll-control-demo">
            <div class="control-panel">
              <div class="control-section">
                <h4>快速导航</h4>
                <div class="nav-buttons">
                  <button class="nav-button" @click="scrollControlToPosition(0)">开始</button>
                  <button class="nav-button" @click="scrollControlToPosition(25)">25%</button>
                  <button class="nav-button" @click="scrollControlToPosition(50)">50%</button>
                  <button class="nav-button" @click="scrollControlToPosition(75)">75%</button>
                  <button class="nav-button" @click="scrollControlToPosition(100)">结束</button>
                  <button class="nav-button debug-btn" @click="showContainerInfo">调试</button>
                </div>
              </div>

              <div class="control-section">
                <h4>滚动模式</h4>
                <div class="mode-buttons">
                  <button class="mode-button" :class="{ active: autoScroll }" @click="autoScroll = !autoScroll">
                    {{ autoScroll ? '停止' : '开始' }}自动滚动
                  </button>
                  <button class="mode-button" :class="{ active: smoothScroll }" @click="smoothScroll = !smoothScroll">
                    {{ smoothScroll ? '关闭' : '开启' }}平滑滚动
                  </button>
                </div>
              </div>
            </div>

            <div
              v-scroll="{
                direction: 'vertical',
                autoScroll: autoScroll,
                autoScrollSpeed: scrollSpeed,
                smooth: smoothScroll,
                onScroll: onScrollUpdate,
              }"
              class="control-scroll-container"
            >
              <div class="control-content">
                <div class="milestone" v-for="i in 10" :key="i">
                  <div class="milestone-marker">{{ i }}</div>
                  <div class="milestone-content">
                    <h4>里程碑 {{ i }}</h4>
                    <p>这是第 {{ i }} 个滚动里程碑，展示滚动控制的效果。</p>
                    <div class="milestone-details">
                      <span class="detail-item">位置: ~{{ Math.round((i - 1) * 11.11) }}%</span>
                      <span class="detail-item">里程碑: {{ i }}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">📱 响应式滚动</div>
        <div class="demo-content">
          <p class="demo-desc">适配不同设备的滚动体验</p>
          <div class="responsive-scroll-demo">
            <div class="device-tabs">
              <div class="tab active">桌面端</div>
              <div class="tab">平板端</div>
              <div class="tab">移动端</div>
            </div>

            <div
              v-scroll="{
                direction: 'vertical',
                responsive: true,
                mobileOptimized: true,
                touchEnabled: true,
                onScroll: onScrollUpdate,
              }"
              class="responsive-container"
            >
              <div class="responsive-content">
                <div class="responsive-header">
                  <h3>响应式内容</h3>
                  <p>这个容器会根据设备类型优化滚动体验</p>
                </div>

                <div class="responsive-grid">
                  <div class="responsive-card" v-for="i in 12" :key="i">
                    <div class="card-image">🖼️</div>
                    <div class="card-content">
                      <h4>响应式卡片 {{ i }}</h4>
                      <p>适配不同屏幕尺寸的卡片内容</p>
                    </div>
                  </div>
                </div>

                <div class="responsive-footer">
                  <p>滚动体验已针对当前设备优化</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="code-section">
        <div class="code-title">💻 使用示例</div>
        <div class="code-content">
          <pre><code>&lt;!-- 基础用法 --&gt;
&lt;div v-scroll&gt;滚动内容&lt;/div&gt;

&lt;!-- 垂直滚动监听 --&gt;
&lt;div v-scroll="{
  direction: 'vertical',
  onScroll: handleScroll
}"&gt;垂直滚动内容&lt;/div&gt;

&lt;!-- 水平滚动（支持鼠标滚轮） --&gt;
&lt;div v-scroll="{
  direction: 'horizontal',
  threshold: 50,
  smooth: true,
  wheelHorizontal: true
}"&gt;水平滚动内容&lt;/div&gt;

&lt;!-- 双向滚动 --&gt;
&lt;div v-scroll="{
  direction: 'both',
  wheelHorizontal: true,
  onScroll: (data) =&gt; {
    console.log('滚动位置:', data.position)
    console.log('滚动百分比:', data.percentage)
    console.log('滚动方向:', data.direction)
  }
}"&gt;双向滚动内容（按 Shift + 滚轮水平滚动）&lt;/div&gt;

&lt;!-- 自动滚动 --&gt;
&lt;div v-scroll="{
  autoScroll: true,
  autoScrollSpeed: 50,
  direction: 'vertical'
}"&gt;自动滚动内容&lt;/div&gt;

&lt;!-- 滚动触发动画 --&gt;
&lt;div v-scroll="{
  threshold: 100,
  onEnter: (el) =&gt; el.classList.add('fade-in'),
  onLeave: (el) =&gt; el.classList.remove('fade-in')
}"&gt;滚动动画内容&lt;/div&gt;

&lt;!-- 响应式滚动 --&gt;
&lt;div v-scroll="{
  responsive: true,
  mobileOptimized: true,
  touchEnabled: true,
  momentum: true
}"&gt;响应式滚动内容&lt;/div&gt;

&lt;!-- 完整配置 --&gt;
&lt;div v-scroll="{
  direction: 'vertical',
  threshold: 100,
  smooth: true,
  showScrollbar: true,
  autoScroll: false,
  autoScrollSpeed: 50,
  responsive: true,
  onScroll: handleScroll,
  onScrollStart: handleScrollStart,
  onScrollEnd: handleScrollEnd
}"&gt;完整配置滚动内容&lt;/div&gt;</code></pre>
        </div>
      </div>

      <div class="feature-section">
        <div class="feature-title">✨ 功能特点</div>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <div class="feature-content">
              <h4>滚动监听</h4>
              <p>实时监听滚动位置、方向、速度等状态信息</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎮</div>
            <div class="feature-content">
              <h4>程序控制</h4>
              <p>支持程序化控制滚动位置和行为</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔄</div>
            <div class="feature-content">
              <h4>多向滚动</h4>
              <p>支持垂直、水平和双向滚动模式</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <div class="feature-content">
              <h4>响应式</h4>
              <p>针对不同设备优化滚动体验</p>
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
    background: linear-gradient(135deg, #e3f2fd 0%, #2196f3 100%);
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
}

.scroll-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
  border-radius: 8px;
  border-left: 4px solid #0ea5e9;

  .tip-icon {
    font-size: 20px;
    line-height: 1;
    flex-shrink: 0;
  }

  .tip-text {
    flex: 1;
    font-size: 14px;
    line-height: 1.6;
    color: #0284c7;

    strong {
      color: #0c4a6e;
      font-weight: 600;
    }
  }
}

.auto-scroll-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-radius: 8px;
  border-left: 4px solid #4caf50;
  animation: pulse 2s infinite;

  .tip-icon {
    font-size: 20px;
    line-height: 1;
    flex-shrink: 0;
  }

  .tip-text {
    flex: 1;
    font-size: 14px;
    line-height: 1.6;
    color: #0284c7;

    strong {
      color: #0c4a6e;
      font-weight: 600;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.config-controls {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  .control-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .control-label {
        font-weight: 500;
        color: #374151;
        font-size: 14px;
      }

      .speed-slider,
      .threshold-slider {
        width: 100%;
      }

      .checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    }
  }
}

.scroll-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 20px;

  .stat-item {
    background: white;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    text-align: center;

    .stat-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }

    .stat-value {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }
}

.scroll-progress {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  .progress-label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
  }
}

.scroll-demo {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;

  .scroll-controls {
    padding: 16px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .scroll-container {
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;

    &.hide-scrollbar {
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .scroll-content {
      padding: 0;

      .content-section {
        padding: 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);

        &:last-child {
          border-bottom: none;
        }

        h3 {
          margin: 0 0 12px 0;
          font-size: 20px;
          font-weight: 600;
          color: #333;
        }

        p {
          margin: 0 0 16px 0;
          color: #666;
          line-height: 1.6;
        }
      }
    }
  }
}

.horizontal-scroll-demo {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;

  .horizontal-scroll-container {
    overflow-x: auto;
    overflow-y: hidden;
    padding: 20px 0;

    .horizontal-content {
      display: flex;
      gap: 16px;
      padding: 0 20px;
      width: max-content;

      .horizontal-item {
        width: 200px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px;
        flex-shrink: 0;

        .item-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;

          .item-avatar {
            width: 32px;
            height: 32px;
            background: #2196f3;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
          }

          .item-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }
        }

        .item-body {
          margin-bottom: 12px;

          p {
            margin: 0 0 8px 0;
            font-size: 14px;
            color: #666;
          }

          .item-tags {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;

            .tag {
              padding: 2px 6px;
              background: #e3f2fd;
              color: #1976d2;
              border-radius: 4px;
              font-size: 12px;
            }
          }
        }

        .item-footer {
          text-align: center;

          .item-button {
            padding: 6px 12px;
            background: #2196f3;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
          }
        }
      }
    }
  }
}

.scroll-animation-demo {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;

  .animation-scroll-container {
    height: 300px;
    overflow-y: auto;

    .animation-content {
      padding: 20px;

      .animation-section {
        padding: 24px;
        margin-bottom: 16px;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        opacity: 0.3;
        transform: translateX(-20px);
        transition: all 0.6s ease;

        &.animate-in {
          opacity: 1;
          transform: translateX(0);
        }

        .section-content {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;

          .section-icon {
            font-size: 32px;
          }

          .section-text {
            h4 {
              margin: 0 0 4px 0;
              font-size: 18px;
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

        .section-progress {
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;

          .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #4caf50, #8bc34a);
            transition: width 0.3s ease;
          }
        }
      }
    }
  }
}

.scroll-control-demo {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;

  .control-panel {
    padding: 20px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;

    .control-section {
      h4 {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .nav-buttons,
      .mode-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        .nav-button,
        .mode-button {
          padding: 8px 12px;
          background: #e2e8f0;
          color: #333;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: #cbd5e1;
          }
        }

        .nav-button.debug-btn {
          background: #fbbf24;
          color: #78350f;

          &:hover {
            background: #f59e0b;
          }
        }

        .mode-button.active {
          background: #2196f3;
          color: white;
        }
      }
    }
  }

  .control-scroll-container {
    height: 250px;
    overflow-y: auto;
    padding: 20px;

    .control-content {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .milestone {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e2e8f0;

        .milestone-marker {
          width: 40px;
          height: 40px;
          background: #2196f3;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
        }

        .milestone-content {
          flex: 1;

          h4 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }

          p {
            margin: 0 0 8px 0;
            font-size: 14px;
            color: #666;
          }

          .milestone-details {
            display: flex;
            gap: 16px;

            .detail-item {
              font-size: 12px;
              color: #888;
            }
          }
        }
      }
    }
  }
}

.responsive-scroll-demo {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;

  .device-tabs {
    display: flex;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;

    .tab {
      padding: 12px 20px;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;

      &.active {
        color: #2196f3;
        border-bottom-color: #2196f3;
        background: white;
      }
    }
  }

  .responsive-container {
    height: 300px;
    overflow-y: auto;

    .responsive-content {
      padding: 20px;

      .responsive-header {
        text-align: center;
        margin-bottom: 24px;

        h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: #333;
        }

        p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
      }

      .responsive-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 24px;

        .responsive-card {
          padding: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          text-align: center;

          .card-image {
            font-size: 32px;
            margin-bottom: 12px;
          }

          .card-content {
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

      .responsive-footer {
        text-align: center;
        padding: 20px;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e2e8f0;

        p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
      }
    }
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

// 调试信息面板样式
.debug-info-panel {
  margin-top: 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .debug-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #fff;
    border-bottom: 1px solid #e9ecef;

    .debug-title {
      font-weight: 600;
      color: #495057;
      font-size: 14px;
    }
  }

  .debug-content {
    padding: 16px;
    margin: 0;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    line-height: 1.5;
    color: #495057;
    background: #f8f9fa;
    white-space: pre-wrap;
    word-wrap: break-word;
    max-height: 300px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;

      &-track {
        background: #e9ecef;
      }

      &-thumb {
        background: #ced4da;
        border-radius: 3px;

        &:hover {
          background: #adb5bd;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .config-controls .control-row {
    grid-template-columns: 1fr;
  }

  .control-panel {
    grid-template-columns: 1fr;
  }

  .responsive-grid {
    grid-template-columns: 1fr;
  }

  .horizontal-content {
    padding: 0 10px;

    .horizontal-item {
      width: 160px;
    }
  }
}
</style>
