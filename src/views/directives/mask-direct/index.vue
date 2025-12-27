<script setup lang="ts" name="maskDirect">
import { reactive, ref } from 'vue'

// 基础遮罩
const showBasicMask = ref(false)

// 带内容的遮罩
const maskWithContent = reactive({
  visible: false,
  content: '<div style="text-align: center;"><div style="margin-bottom: 10px;">⏳</div><div>正在加载...</div></div>',
  background: 'rgba(0, 0, 0, 0.7)',
})

function toggleContentMask() {
  maskWithContent.visible = !maskWithContent.visible
}

// 可点击关闭的遮罩
const clickableMask = reactive({
  visible: false,
  content: '<div style="padding: 20px; background: white; border-radius: 8px; color: #333;">点击遮罩区域关闭</div>',
  clickToClose: true,
  background: 'rgba(0, 0, 0, 0.6)',
})

function showClickableMask() {
  clickableMask.visible = true
}

// 监听遮罩关闭事件
function handleMaskClose(event: CustomEvent) {
  if (event.detail?.reason === 'click') {
    clickableMask.visible = false
  }
}

// 自定义样式遮罩
const customStyleMask = reactive({
  visible: false,
  content: '🎨 自定义样式遮罩',
  background: 'linear-gradient(45deg, rgba(255, 0, 150, 0.3), rgba(0, 255, 255, 0.3))',
  contentStyle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    padding: '30px',
    borderRadius: '15px',
    background: 'rgba(0, 0, 0, 0.8)',
    border: '2px solid #fff',
  },
})

function toggleCustomMask() {
  customStyleMask.visible = !customStyleMask.visible
}
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
            <h3 class="header-title">遮罩指令</h3>
            <p class="header-desc">为元素添加遮罩层效果，支持自定义内容和交互</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">🎭 基础遮罩</div>
        <div class="demo-content">
          <p class="demo-desc">点击按钮显示/隐藏基础遮罩效果</p>
          <div class="mask-demo" v-mask="showBasicMask">
            <div class="demo-box">
              <h3>内容区域</h3>
              <p>这是一个演示区域，遮罩会覆盖整个区域。</p>
              <p>基础遮罩提供简单的覆盖效果。</p>
            </div>
          </div>
          <NButton @click="showBasicMask = !showBasicMask" type="primary" size="large" class="demo-btn">
            {{ showBasicMask ? '隐藏遮罩' : '显示遮罩' }}
          </NButton>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">📝 带内容的遮罩</div>
        <div class="demo-content">
          <p class="demo-desc">遮罩可以显示自定义内容和样式</p>
          <div class="mask-demo" v-mask="maskWithContent">
            <div class="demo-box">
              <h3>自定义内容遮罩</h3>
              <p>这个遮罩会显示自定义的加载内容。</p>
              <p>支持HTML内容和自定义背景色。</p>
            </div>
          </div>
          <NButton @click="toggleContentMask" type="info" size="large" class="demo-btn">
            {{ maskWithContent.visible ? '隐藏遮罩' : '显示遮罩' }}
          </NButton>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">👆 可点击关闭的遮罩</div>
        <div class="demo-content">
          <p class="demo-desc">点击遮罩区域（非内容区域）可以关闭遮罩</p>
          <div class="mask-demo" v-mask="clickableMask" @mask-close="handleMaskClose">
            <div class="demo-box">
              <h3>交互式遮罩</h3>
              <p>这个遮罩支持点击关闭功能。</p>
              <p>点击遮罩背景区域即可关闭。</p>
            </div>
          </div>
          <NButton @click="showClickableMask" type="success" size="large" class="demo-btn"> 显示可点击关闭的遮罩 </NButton>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">🎨 自定义样式遮罩</div>
        <div class="demo-content">
          <p class="demo-desc">完全自定义的遮罩样式和内容</p>
          <div class="mask-demo" v-mask="customStyleMask">
            <div class="demo-box">
              <h3>样式定制遮罩</h3>
              <p>这个遮罩使用了渐变背景和自定义样式。</p>
              <p>展示了遮罩的高度可定制性。</p>
            </div>
          </div>
          <NButton @click="toggleCustomMask" type="warning" size="large" class="demo-btn">
            {{ customStyleMask.visible ? '隐藏遮罩' : '显示遮罩' }}
          </NButton>
        </div>
      </div>

      <div class="code-section">
        <div class="code-title">💻 使用示例</div>
        <div class="code-content">
          <pre><code>&lt;!-- 基础用法 --&gt;
&lt;div v-mask="true"&gt;
  内容区域
&lt;/div&gt;

&lt;!-- 自定义配置 --&gt;
&lt;div v-mask="{
  visible: true,
  background: 'rgba(0, 0, 0, 0.7)',
  content: '加载中...',
  clickToClose: true
}"&gt;
  内容区域
&lt;/div&gt;

&lt;!-- 监听关闭事件 --&gt;
&lt;div v-mask="maskConfig" @mask-close="handleClose"&gt;
  内容区域
&lt;/div&gt;</code></pre>
        </div>
      </div>

      <div class="feature-section">
        <div class="feature-title">✨ 功能特点</div>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <div class="feature-content">
              <h4>智能遮罩</h4>
              <p>自动创建遮罩层覆盖目标元素</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <div class="feature-content">
              <h4>自定义样式</h4>
              <p>支持自定义背景、内容和样式</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">👆</div>
            <div class="feature-content">
              <h4>交互支持</h4>
              <p>支持点击关闭和事件监听</p>
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

    .mask-demo {
      position: relative;
      margin-bottom: 16px;
      min-height: 120px;

      .demo-box {
        background: white;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;

        h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        p {
          margin: 0 0 8px 0;
          color: #666;
          line-height: 1.5;
        }
      }
    }

    .demo-btn {
      margin-top: 8px;
    }
  }
}

.code-section {
  margin-bottom: 32px;
}

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
}

.code-content pre {
  margin: 0;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.feature-section {
  margin-bottom: 32px;
}

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
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.feature-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.feature-content h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.feature-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}
</style>
