<script setup lang="ts" name="clickoutsideDirect">
import { ref } from 'vue'

definePage({
  meta: {
    title: '点击外部指令',
    i18nKey: 'route.clickoutsideDirect',
    order: 8,
  },
})

const isDropdownOpen = ref(false)
const isModalOpen = ref(false)
const isTooltipOpen = ref(false)
const clickCount = ref(0)

const handleClickOutside = () => {
  isDropdownOpen.value = false
  clickCount.value++
}

const handleModalClickOutside = () => {
  isModalOpen.value = false
}

const handleTooltipClickOutside = () => {
  isTooltipOpen.value = false
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const openModal = () => {
  isModalOpen.value = true
}

const toggleTooltip = () => {
  isTooltipOpen.value = !isTooltipOpen.value
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
          <div class="dropdown-container">
            <NButton @click="toggleDropdown" type="primary" size="large">
              {{ isDropdownOpen ? '关闭菜单' : '打开菜单' }}
              <template #icon>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </template>
            </NButton>
            <div v-show="isDropdownOpen" v-clickoutside="handleClickOutside" class="dropdown-menu" :class="{ active: isDropdownOpen }">
              <div class="dropdown-item">菜单项 1</div>
              <div class="dropdown-item">菜单项 2</div>
              <div class="dropdown-item">菜单项 3</div>
              <div class="dropdown-item">菜单项 4</div>
            </div>
          </div>
          <div class="click-counter">
            <span>外部点击次数: {{ clickCount }}</span>
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

&lt;!-- 下拉菜单 --&gt;
&lt;div v-clickoutside="closeDropdown" class="dropdown"&gt;
  &lt;button @click="toggleDropdown"&gt;菜单&lt;/button&gt;
  &lt;div v-show="isOpen" class="menu"&gt;
    菜单内容
  &lt;/div&gt;
&lt;/div&gt;

&lt;!-- 模态框 --&gt;
&lt;div v-clickoutside="closeModal" class="modal"&gt;
  模态框内容
&lt;/div&gt;</code></pre>
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

<style scoped>
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
}

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
}

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

.dropdown-container {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.2s ease;
}

.dropdown-menu.active {
  opacity: 1;
  transform: translateY(0);
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f1f5f9;
}

.dropdown-item:first-child {
  border-radius: 8px 8px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 8px 8px;
}

.click-counter {
  padding: 8px 12px;
  background: #e0f2fe;
  border-radius: 6px;
  font-size: 14px;
  color: #0277bd;
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
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.modal-content p {
  margin: 0 0 20px 0;
  color: #666;
  line-height: 1.5;
}

.tooltip-container {
  position: relative;
  display: inline-block;
}

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
}

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
