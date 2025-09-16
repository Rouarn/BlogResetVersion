<script setup lang="ts" name="highlightDirect">
import { ref } from 'vue'

const searchText = ref('Vue')
const highlightColor = ref('#ffeb3b')
const textContent = ref(`Vue.js 是一个用于构建用户界面的渐进式 JavaScript 框架。
与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。
Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。
另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。

Vue.js 的特点包括：
1. 响应式数据绑定
2. 组件化开发
3. 虚拟 DOM
4. 指令系统
5. 模板语法

在实际开发中，我们经常需要对文本进行高亮显示，比如搜索结果高亮、关键词标记等功能。
Vue 的自定义指令为我们提供了一个很好的解决方案。`)

const codeContent = ref(`function highlightText(element, keyword) {
  if (!keyword) return;

  const regex = new RegExp(keyword, 'gi');
  const originalText = element.textContent;
  const highlightedText = originalText.replace(regex, (match) => {
    return \`<mark class="highlight">\${match}</mark>\`;
  });

  element.innerHTML = highlightedText;
}`)

const presetColors = [
  { name: '黄色', value: '#ffeb3b' },
  { name: '绿色', value: '#4caf50' },
  { name: '蓝色', value: '#2196f3' },
  { name: '红色', value: '#f44336' },
  { name: '紫色', value: '#9c27b0' },
  { name: '橙色', value: '#ff9800' },
]

const selectColor = (color: string) => {
  highlightColor.value = color
}

// 动态内容和搜索关键词
const dynamicContent = ref('这是一段动态内容，可以进行高亮显示。Vue.js 是一个优秀的前端框架。')
const _searchKeyword = ref('Vue') // 用于模板中的动态高亮
</script>

<template>
  <div class="directive-container">
    <NCard class="directive-card" :bordered="false">
      <template #header>
        <div class="card-header">
          <div class="header-icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">高亮指令</h3>
            <p class="header-desc">智能文本高亮显示，支持关键词搜索和自定义样式</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">🔍 搜索高亮</div>
        <div class="demo-content">
          <div class="search-controls">
            <div class="control-group">
              <label class="control-label">搜索关键词:</label>
              <NInput v-model:value="searchText" placeholder="输入要高亮的关键词..." class="search-input" clearable />
            </div>
            <div class="control-group">
              <label class="control-label">高亮颜色:</label>
              <div class="color-controls">
                <NColorPicker v-model:value="highlightColor" :show-alpha="false" class="color-picker" />
                <div class="preset-colors">
                  <div
                    v-for="color in presetColors"
                    :key="color.value"
                    class="color-preset"
                    :class="{ active: highlightColor === color.value }"
                    :style="{ backgroundColor: color.value }"
                    :title="color.name"
                    @click="selectColor(color.value)"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="highlight-demo">
            <div class="demo-text">
              <h4>文本高亮演示</h4>
              <div v-highlight="{ keywords: searchText, colors: highlightColor }" class="highlight-content">
                {{ textContent }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">💻 代码高亮</div>
        <div class="demo-content">
          <p class="demo-desc">在代码块中高亮特定的函数名或关键字</p>
          <div class="code-highlight-demo">
            <div class="code-controls">
              <NInput v-model:value="searchText" placeholder="输入要在代码中高亮的内容..." class="code-search" clearable />
            </div>
            <div class="code-block">
              <pre><code
                v-highlight="{ keywords: searchText, colors: highlightColor, caseSensitive: true }"
                class="code-content"
              >{{ codeContent }}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">🎨 多样式高亮</div>
        <div class="demo-content">
          <p class="demo-desc">展示不同样式的高亮效果</p>
          <div class="style-examples">
            <!-- 默认高亮 -->
            <div class="example-item">
              <h4>默认高亮</h4>
              <div v-highlight="'Vue'" class="example-text">Vue.js 是一个优秀的前端框架，Vue 让开发变得更简单。</div>
            </div>

            <!-- 自定义背景色 -->
            <div class="example-item">
              <h4>自定义背景色</h4>
              <div v-highlight="{ keywords: 'JavaScript', colors: '#e3f2fd', textColor: '#1976d2' }" class="example-text">
                JavaScript 是一种动态编程语言，JavaScript 应用广泛。
              </div>
            </div>

            <!-- 边框高亮 -->
            <div class="example-item">
              <h4>边框高亮</h4>
              <div v-highlight="{ keywords: '框架', style: 'border', colors: '#4caf50' }" class="example-text">
                前端框架有很多种，选择合适的框架很重要。
              </div>
            </div>

            <!-- 下划线高亮 -->
            <div class="example-item">
              <h4>下划线高亮</h4>
              <div v-highlight="{ keywords: '组件', style: 'underline', colors: '#ff9800' }" class="example-text">
                组件化开发是现代前端的趋势，组件复用提高效率。
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">⚙️ 高级配置</div>
        <div class="demo-content">
          <div class="advanced-examples">
            <!-- 大小写敏感 -->
            <div class="config-item">
              <h4>大小写敏感</h4>
              <div class="config-demo">
                <div v-highlight="{ keywords: 'Vue', caseSensitive: true }" class="config-text">
                  Vue.js 和 vue.js 在大小写敏感模式下会区别对待。
                </div>
              </div>
            </div>

            <!-- 全词匹配 -->
            <div class="config-item">
              <h4>全词匹配</h4>
              <div class="config-demo">
                <div v-highlight="{ keywords: 'app', wholeWord: true }" class="config-text">
                  app 应用和 application 在全词匹配模式下只会高亮 app。
                </div>
              </div>
            </div>

            <!-- 多关键词 -->
            <div class="config-item">
              <h4>多关键词高亮</h4>
              <div class="config-demo">
                <div v-highlight="{ keywords: ['Vue', 'React', 'Angular'], colors: ['#42b883', '#61dafb', '#dd0031'] }" class="config-text">
                  Vue、React 和 Angular 是三大主流前端框架。
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
&lt;div v-highlight="'关键词'"&gt;要高亮的文本内容&lt;/div&gt;

&lt;!-- 自定义颜色 --&gt;
&lt;div v-highlight="{ keywords: '关键词', colors: '#ffeb3b' }"&gt;
  要高亮的文本内容
&lt;/div&gt;

&lt;!-- 完整配置 --&gt;
&lt;div v-highlight="{
  keywords: '关键词',
  colors: '#ffeb3b',
  textColor: '#333',
  style: 'background', // 'background' | 'border' | 'underline'
  caseSensitive: false,
  wholeWord: false
}"&gt;
  要高亮的文本内容
&lt;/div&gt;

&lt;!-- 多关键词高亮 --&gt;
&lt;div v-highlight="{
  keywords: ['Vue', 'React', 'Angular'],
  colors: ['#42b883', '#61dafb', '#dd0031']
}"&gt;
  Vue、React 和 Angular 框架对比
&lt;/div&gt;

&lt;!-- 动态高亮 --&gt;
&lt;div v-highlight="{ keywords: _searchKeyword, colors: highlightColor }"&gt;
  {{ dynamicContent }}
&lt;/div&gt;</code></pre>
        </div>
      </div>

      <div class="feature-section">
        <div class="feature-title">✨ 功能特点</div>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <div class="feature-content">
              <h4>智能匹配</h4>
              <p>支持大小写敏感、全词匹配等多种匹配模式</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <div class="feature-content">
              <h4>样式丰富</h4>
              <p>支持背景色、边框、下划线等多种高亮样式</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔄</div>
            <div class="feature-content">
              <h4>动态更新</h4>
              <p>响应式更新，关键词变化时自动重新高亮</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🚀</div>
            <div class="feature-content">
              <h4>性能优化</h4>
              <p>高效的文本处理算法，支持大量文本高亮</p>
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
    background: linear-gradient(135deg, #fff3e0 0%, #ffb74d 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
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

.search-controls {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0; // 防止内容溢出

    .control-label {
      font-weight: 500;
      color: #374151;
      font-size: 14px;
      flex-shrink: 0;
    }

    .search-input {
      width: 100%;
      max-width: 100%;
    }
  }
}

.color-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  min-width: 0; // 防止内容溢出

  .color-picker {
    flex-shrink: 0;
  }

  .preset-colors {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    min-width: 0;

    .color-preset {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s;
      flex-shrink: 0;

      &:hover {
        transform: scale(1.1);
      }

      &.active {
        border-color: #333;
        transform: scale(1.1);
      }
    }
  }
}

.highlight-demo {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden; // 防止内容溢出

  .demo-text {
    h4 {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .highlight-content {
      line-height: 1.6;
      color: #374151;
      white-space: pre-line;
      word-wrap: break-word; // 长单词换行
      overflow-wrap: break-word; // 现代浏览器支持
      max-width: 100%; // 确保不超出容器宽度
    }
  }
}

.code-highlight-demo {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;

  .code-controls {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;

    .code-search {
      width: 100%;
    }
  }

  .code-block {
    background: #1e293b;
    color: #e2e8f0;
    padding: 20px;
    overflow-x: auto;

    .code-content {
      font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
    }
  }
}

.style-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  .example-item {
    background: white;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;

    h4 {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .example-text {
      line-height: 1.6;
      color: #374151;
    }
  }
}

.advanced-examples {
  display: grid;
  gap: 20px;

  .config-item {
    background: white;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;

    h4 {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .config-demo {
      padding: 16px;
      background: #f8fafc;
      border-radius: 6px;
      border: 1px solid #e2e8f0;

      .config-text {
        line-height: 1.6;
        color: #374151;
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

@media (max-width: 768px) {
  .search-controls {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .color-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .preset-colors {
      justify-content: flex-start;
    }
  }

  .highlight-demo {
    padding: 16px;
  }
}
</style>
