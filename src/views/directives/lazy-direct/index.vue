<script setup lang="ts" name="lazyDirect">
import { ref } from 'vue'

const imageList = ref([
  {
    id: 1,
    src: 'https://picsum.photos/400/300?random=1',
    placeholder: 'https://via.placeholder.com/400x300/f0f0f0/999?text=Loading...',
    alt: '风景图片 1',
  },
  {
    id: 2,
    src: 'https://picsum.photos/400/300?random=2',
    placeholder: 'https://via.placeholder.com/400x300/f0f0f0/999?text=Loading...',
    alt: '风景图片 2',
  },
  {
    id: 3,
    src: 'https://picsum.photos/400/300?random=3',
    placeholder: 'https://via.placeholder.com/400x300/f0f0f0/999?text=Loading...',
    alt: '风景图片 3',
  },
  {
    id: 4,
    src: 'https://picsum.photos/400/300?random=4',
    placeholder: 'https://via.placeholder.com/400x300/f0f0f0/999?text=Loading...',
    alt: '风景图片 4',
  },
  {
    id: 5,
    src: 'https://picsum.photos/400/300?random=5',
    placeholder: 'https://via.placeholder.com/400x300/f0f0f0/999?text=Loading...',
    alt: '风景图片 5',
  },
  {
    id: 6,
    src: 'https://picsum.photos/400/300?random=6',
    placeholder: 'https://via.placeholder.com/400x300/f0f0f0/999?text=Loading...',
    alt: '风景图片 6',
  },
])

const loadedCount = ref(0)
const onImageLoad = () => {
  loadedCount.value++
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">懒加载指令</h3>
            <p class="header-desc">图片进入视口时才开始加载，提升页面性能</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">📊 加载统计</div>
        <div class="demo-content">
          <div class="stats">
            <div class="stat-item">
              <span class="stat-label">已加载图片:</span>
              <span class="stat-value">{{ loadedCount }} / {{ imageList.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">加载进度:</span>
              <NProgress
                type="line"
                :percentage="Math.round((loadedCount / imageList.length) * 100)"
                :show-indicator="true"
                class="progress-bar"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">🖼️ 懒加载图片展示</div>
        <div class="demo-content">
          <p class="demo-desc">向下滚动查看图片懒加载效果，图片只有在进入视口时才会开始加载</p>
          <div class="image-grid">
            <div v-for="image in imageList" :key="image.id" class="image-item">
              <div class="image-wrapper">
                <img
                  v-lazy="{
                    src: image.src,
                    placeholder: image.placeholder,
                    error: 'https://via.placeholder.com/400x300/ff6b6b/fff?text=Error',
                  }"
                  :alt="image.alt"
                  class="lazy-image"
                  @load="onImageLoad"
                />
                <div class="image-overlay">
                  <div class="image-info">
                    <h4>{{ image.alt }}</h4>
                    <p>ID: {{ image.id }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">⚙️ 自定义配置示例</div>
        <div class="demo-content">
          <p class="demo-desc">展示不同配置选项的懒加载效果</p>
          <div class="config-examples">
            <!-- 基础懒加载 -->
            <div class="example-item">
              <h4>基础懒加载</h4>
              <img v-lazy="'https://picsum.photos/300/200?random=10'" alt="基础懒加载" class="example-image" />
            </div>

            <!-- 带占位符 -->
            <div class="example-item">
              <h4>带占位符</h4>
              <img
                v-lazy="{
                  src: 'https://picsum.photos/300/200?random=11',
                  placeholder: 'https://via.placeholder.com/300x200/e3f2fd/1976d2?text=Loading...',
                }"
                alt="带占位符"
                class="example-image"
              />
            </div>

            <!-- 自定义错误图片 -->
            <div class="example-item">
              <h4>自定义错误图片</h4>
              <img
                v-lazy="{
                  src: 'https://invalid-url-for-demo.jpg',
                  placeholder: 'https://via.placeholder.com/300x200/fff3e0/f57c00?text=Loading...',
                  error: 'https://via.placeholder.com/300x200/ffebee/d32f2f?text=Load+Failed',
                }"
                alt="错误处理"
                class="example-image"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">🎯 性能优势</div>
        <div class="demo-content">
          <div class="performance-info">
            <div class="info-card">
              <div class="info-icon">⚡</div>
              <div class="info-content">
                <h4>减少初始加载时间</h4>
                <p>只加载可见区域的图片，大幅减少页面初始加载时间</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-icon">💾</div>
              <div class="info-content">
                <h4>节省带宽流量</h4>
                <p>用户不滚动到的图片不会被加载，节省网络流量</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-icon">🚀</div>
              <div class="info-content">
                <h4>提升用户体验</h4>
                <p>页面响应更快，滚动更流畅，用户体验显著提升</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="code-section">
        <div class="code-title">💻 使用示例</div>
        <div class="code-content">
          <pre><code>&lt;!-- 基础用法 --&gt;
&lt;img v-lazy="'image-url.jpg'" alt="图片" /&gt;

&lt;!-- 带占位符 --&gt;
&lt;img v-lazy="{
  src: 'image-url.jpg',
  placeholder: 'placeholder.jpg'
}" alt="图片" /&gt;

&lt;!-- 完整配置 --&gt;
&lt;img v-lazy="{
  src: 'image-url.jpg',
  placeholder: 'loading.jpg',
  error: 'error.jpg',
  threshold: 0.1,
  rootMargin: '50px'
}" alt="图片" /&gt;

&lt;!-- 背景图片懒加载 --&gt;
&lt;div v-lazy:background="'bg-image.jpg'" class="bg-container"&gt;
  背景图片内容
&lt;/div&gt;</code></pre>
        </div>
      </div>

      <div class="feature-section">
        <div class="feature-title">✨ 功能特点</div>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">👁️</div>
            <div class="feature-content">
              <h4>视口检测</h4>
              <p>基于 Intersection Observer API 精确检测元素可见性</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🖼️</div>
            <div class="feature-content">
              <h4>占位符支持</h4>
              <p>支持自定义占位符和错误图片</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚙️</div>
            <div class="feature-content">
              <h4>灵活配置</h4>
              <p>支持阈值、边距等多种配置选项</p>
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
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
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
}

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
}

.demo-desc {
  margin: 0 0 16px 0;
  color: #64748b;
  font-size: 14px;
}

.stats {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-label {
  font-weight: 500;
  color: #374151;
  min-width: 100px;
}

.stat-value {
  font-weight: 600;
  color: #059669;
}

.progress-bar {
  flex: 1;
  max-width: 200px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;

  .image-item {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.2s,
      box-shadow 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);

      .lazy-image {
        transform: scale(1.05);
      }

      .image-overlay {
        transform: translateY(0);
      }
    }

    .image-wrapper {
      position: relative;
      overflow: hidden;

      .lazy-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        transition: transform 0.3s;
      }

      .image-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
        color: white;
        padding: 16px;
        transform: translateY(100%);
        transition: transform 0.3s;

        .image-info {
          h4 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 600;
          }

          p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
          }
        }
      }
    }
  }
}

.config-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.example-item {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.example-item h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.example-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
}

.performance-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.info-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.info-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.info-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
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
