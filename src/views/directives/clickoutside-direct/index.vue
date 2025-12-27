<script setup lang="ts" name="clickoutsideDirect">
import { ref } from 'vue'
import { useMessage } from 'naive-ui'

const message = useMessage()
const isDropdownOpen = ref(false)
const isModalOpen = ref(false)
const isTooltipOpen = ref(false)
const clickCount = ref(0)

const handleClickOutside = (event: Event) => {
  // 检查点击的目标是否是触发按钮
  const target = event.target as HTMLElement
  const dropdownTrigger = document.querySelector('.dropdown-trigger')

  // 如果点击的是触发按钮或其子元素，不关闭菜单
  if (dropdownTrigger && (dropdownTrigger.contains(target) || dropdownTrigger === target)) {
    return
  }

  isDropdownOpen.value = false
  clickCount.value++
}

const handleModalClickOutside = () => {
  isModalOpen.value = false
}

const handleTooltipClickOutside = () => {
  isTooltipOpen.value = false
}

const toggleDropdown = (event: Event) => {
  event.stopPropagation() // 阻止事件冒泡
  isDropdownOpen.value = !isDropdownOpen.value
}

const openModal = () => {
  isModalOpen.value = true
}

const toggleTooltip = () => {
  isTooltipOpen.value = !isTooltipOpen.value
}

const handleMenuItemClick = (itemName: string, event: Event) => {
  event.stopPropagation() // 阻止事件冒泡
  message.success(`点击了${itemName}`)
  isDropdownOpen.value = false // 点击菜单项后关闭菜单
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
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          </div>
          <div class="header-content">
            <h3 class="header-title">点击外部指令</h3>
            <p class="header-desc">检测点击元素外部区域的事件</p>
          </div>
        </div>
      </template>

      <div class="demo-section">
        <div class="demo-title">🎯 下拉菜单示例</div>
        <div class="demo-content">
          <p class="demo-desc">点击按钮打开菜单，点击外部区域关闭菜单</p>
          <div class="demo-info">
            <div class="info-item">
              <span class="info-label">当前状态：</span>
              <NBadge :value="isDropdownOpen ? '已打开' : '已关闭'" :type="isDropdownOpen ? 'success' : 'default'" />
            </div>
            <div class="info-item">
              <span class="info-label">外部点击次数：</span>
              <NBadge :value="clickCount" type="info" />
            </div>
          </div>
          <div class="dropdown-container">
            <NButton @click="toggleDropdown" type="primary" size="large" class="dropdown-trigger">
              {{ isDropdownOpen ? '关闭菜单' : '打开菜单' }}
              <template #icon>
                <svg
                  class="w-4 h-4 dropdown-icon"
                  :class="{ 'rotate-180': isDropdownOpen }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </template>
            </NButton>
            <div v-show="isDropdownOpen" v-clickoutside="handleClickOutside" class="dropdown-menu" :class="{ active: isDropdownOpen }">
              <div class="dropdown-header">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>菜单选项</span>
              </div>
              <div class="dropdown-item" @click="(event) => handleMenuItemClick('用户管理', event)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                用户管理
              </div>
              <div class="dropdown-item" @click="(event) => handleMenuItemClick('系统设置', event)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                系统设置
              </div>
              <div class="dropdown-item" @click="(event) => handleMenuItemClick('报表统计', event)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                报表统计
              </div>
              <div class="dropdown-item danger" @click="(event) => handleMenuItemClick('退出登录', event)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                退出登录
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">🪟 模态框示例</div>
        <div class="demo-content">
          <p class="demo-desc">点击模态框外部区域关闭模态框</p>
          <NButton @click="openModal" type="info" size="large"> 打开模态框 </NButton>
          <div v-show="isModalOpen" class="modal-overlay">
            <div v-clickoutside="handleModalClickOutside" class="modal-content">
              <h3>模态框标题</h3>
              <p>这是一个模态框内容，点击外部区域可以关闭它。</p>
              <NButton @click="isModalOpen = false" type="primary"> 关闭 </NButton>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-title">💬 工具提示示例</div>
        <div class="demo-content">
          <p class="demo-desc">点击按钮显示提示，点击外部区域隐藏</p>
          <div class="tooltip-container">
            <NButton @click="toggleTooltip" type="warning" size="large">
              {{ isTooltipOpen ? '隐藏提示' : '显示提示' }}
            </NButton>
            <div v-show="isTooltipOpen" v-clickoutside="handleTooltipClickOutside" class="tooltip-popup">
              <div class="tooltip-arrow"></div>
              <div class="tooltip-content">这是一个工具提示内容</div>
            </div>
          </div>
        </div>
      </div>

      <div class="code-section">
        <div class="code-title">💻 使用示例</div>
        <div class="code-content">
          <pre><code>&lt;!-- 基础用法 --&gt;
&lt;div v-clickoutside="handleClickOutside"&gt;
  点击我外部区域触发事件
&lt;/div&gt;

&lt;!-- 下拉菜单（重要：避免事件冒泡） --&gt;
&lt;div class="dropdown-container"&gt;
  &lt;button @click="toggleDropdown" class="dropdown-trigger"&gt;菜单&lt;/button&gt;
  &lt;div v-show="isOpen" v-clickoutside="handleClickOutside" class="menu"&gt;
    &lt;div @click="handleMenuClick"&gt;菜单项&lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;

&lt;script&gt;
const handleClickOutside = (event) =&gt; {
  // 检查点击目标是否为触发按钮
  const trigger = document.querySelector('.dropdown-trigger')
  if (trigger &amp;&amp; trigger.contains(event.target)) {
    return // 不关闭菜单
  }
  isOpen.value = false
}

const toggleDropdown = (event) =&gt; {
  event.stopPropagation() // 阻止事件冒泡
  isOpen.value = !isOpen.value
}
&lt;/script&gt;</code></pre>
        </div>

        <div class="solution-tips">
          <div class="tip-title">💡 解决方案说明</div>
          <div class="tip-list">
            <div class="tip-item">
              <div class="tip-icon">✅</div>
              <div class="tip-content"><strong>使用 mousedown 事件：</strong>替代 click 事件，避免于按钮点击的时序问题</div>
            </div>
            <div class="tip-item">
              <div class="tip-icon">✅</div>
              <div class="tip-content"><strong>增加延迟时间：</strong>从 0ms 增加到 100ms，确保按钮点击事件先完成</div>
            </div>
            <div class="tip-item">
              <div class="tip-icon">✅</div>
              <div class="tip-content"><strong>事件冒泡控制：</strong>在按钮和菜单项点击事件中使用 stopPropagation()</div>
            </div>
            <div class="tip-item">
              <div class="tip-icon">✅</div>
              <div class="tip-content"><strong>目标检查：</strong>在 handleClickOutside 中检查点击目标是否为触发元素</div>
            </div>
          </div>
        </div>
      </div>

      <div class="feature-section">
        <div class="feature-title">✨ 功能特点</div>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <div class="feature-content">
              <h4>精确检测</h4>
              <p>准确检测点击是否在元素外部</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <div class="feature-content">
              <h4>性能优化</h4>
              <p>自动管理事件监听器的添加和移除</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔧</div>
            <div class="feature-content">
              <h4>易于使用</h4>
              <p>简单的指令语法，无需复杂配置</p>
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
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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

.demo-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  .info-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .info-label {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }
  }
}

.dropdown-container {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;

  .dropdown-trigger {
    position: relative;
  }

  .dropdown-icon {
    transition: transform 0.2s ease;

    &.rotate-180 {
      transform: rotate(180deg);
    }
  }
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 220px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
  transition: all 0.2s ease;
  overflow: hidden;

  &.active {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f1f5f9;
    color: #1f2937;
  }

  &.danger {
    color: #dc2626;

    &:hover {
      background-color: #fef2f2;
      color: #dc2626;
    }
  }
}

.click-counter {
  margin-top: 16px;
  padding: 8px 12px;
  background: #e0f2fe;
  border-radius: 6px;
  font-size: 14px;
  color: #0277bd;
  display: inline-block;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;

  .modal-content {
    background: white;
    padding: 24px;
    border-radius: 12px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

    h3 {
      margin: 0 0 16px 0;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    p {
      margin: 0 0 20px 0;
      color: #666;
      line-height: 1.5;
    }
  }
}

.tooltip-container {
  position: relative;
  display: inline-block;

  .tooltip-popup {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
    background: #333;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    white-space: nowrap;
    z-index: 1000;

    .tooltip-arrow {
      position: absolute;
      top: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 4px solid #333;
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

.solution-tips {
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  border-radius: 12px;
  border-left: 4px solid #00acc1;

  .tip-title {
    font-size: 16px;
    font-weight: 600;
    color: #00695c;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tip-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .tip-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 8px;
      border: 1px solid rgba(0, 172, 193, 0.2);

      .tip-icon {
        font-size: 16px;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .tip-content {
        flex: 1;
        font-size: 14px;
        line-height: 1.5;
        color: #37474f;

        strong {
          color: #00695c;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
