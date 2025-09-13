/**
 * Vite 插件：完全自动化的加载动画插件
 * 零入侵，自动检测应用状态并管理加载动画
 */

import type { PluginOption } from 'vite'

// 简化的配置类型
interface LoadingConfig {
  /** 是否启用加载动画 */
  enabled?: boolean
  /** 最小显示时间（毫秒） */
  minDisplayTime?: number
  /** 淡出动画时间（毫秒） */
  fadeOutDuration?: number
}

export function setupLoadingPlugin(_config: LoadingConfig = {}): PluginOption {
  return {
    name: 'auto-loading-plugin',
    transformIndexHtml(html: string) {
      // 注入完全自动化的加载系统
      const loadingHtml = `
<style>
/* 加载动画样式 */
.auto-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.auto-loading-overlay.fade-out {
  opacity: 0;
}

.auto-loader {
  width: 180px;
  height: 180px;
  position: relative;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #4bc0c8;
  animation: auto-spin 2s linear infinite;
  box-shadow: 0 0 30px rgba(75, 192, 200, 0.3);
}

.auto-loader::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 6px;
  right: 6px;
  bottom: 6px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #c779d0;
  animation: auto-spin 3s linear infinite;
  box-shadow: 0 0 20px rgba(199, 121, 208, 0.3);
}

.auto-loader::after {
  content: '';
  position: absolute;
  left: 16px;
  top: 16px;
  right: 16px;
  bottom: 16px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #feac5e;
  animation: auto-spin 1.5s linear infinite;
  box-shadow: 0 0 15px rgba(254, 172, 94, 0.3);
}

.auto-loading-progress {
  position: absolute;
  bottom: 140px;
  width: 200px;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.auto-loading-progress-bar {
  width: 0%;
  height: 100%;
  background-color: #4bc0c8;
  border-radius: 2px;
  transition: width 0.3s ease-out;
  box-shadow: 0 0 10px rgba(75, 192, 200, 0.6);
}

.auto-loading-percentage {
  position: absolute;
  bottom: 110px;
  color: #4bc0c8;
  font-size: 14px;
  font-weight: 600;
}

.auto-loading-text {
  position: absolute;
  bottom: 80px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  text-align: center;
  animation: auto-pulse 2s ease-in-out infinite;
}

@keyframes auto-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes auto-pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

@media (max-width: 768px) {
  .auto-loader { width: 120px; height: 120px; }
  .auto-loader::before { left: 8px; top: 8px; right: 8px; bottom: 8px; }
  .auto-loader::after { left: 18px; top: 18px; right: 18px; bottom: 18px; }
  .auto-loading-text { font-size: 14px; bottom: 60px; }
}
</style>

<script>
// 完全自动化的加载管理器
(function() {
  'use strict';

  let startTime = Date.now();
  let progress = 0;
  let currentStage = '正在初始化应用...';
  let overlay = null;
  let isVisible = false;

  const stages = [
    { name: 'dom-ready', text: '正在加载DOM...' },
    { name: 'scripts', text: '正在加载脚本...' },
    { name: 'styles', text: '正在加载样式...' },
    { name: 'vue-app', text: '正在初始化Vue应用...' },
    { name: 'router', text: '正在初始化路由...' },
    { name: 'store', text: '正在初始化状态管理...' },
    { name: 'plugins', text: '正在加载插件...' },
    { name: 'mount', text: '正在挂载应用...' },
    { name: 'render', text: '正在渲染页面...' }
  ];

  let completedStages = 0;
  let autoStageTimer = null;
  let hideTimer = null;

  // 创建加载界面
  function createLoadingOverlay() {
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.className = 'auto-loading-overlay';
    overlay.id = 'auto-app-loading';

    overlay.innerHTML = \`
      <div class="auto-loader"></div>
      <div class="auto-loading-progress">
        <div class="auto-loading-progress-bar" id="auto-progress-bar"></div>
      </div>
      <div class="auto-loading-percentage" id="auto-loading-percentage">0%</div>
      <div class="auto-loading-text" id="auto-loading-text">正在初始化应用...</div>
    \`;

    document.body.appendChild(overlay);
    isVisible = true;
    return overlay;
  }

  // 更新进度
  function updateProgress() {
    progress = Math.round((completedStages / stages.length) * 100);
    const progressBar = document.getElementById('auto-progress-bar');
    const percentageEl = document.getElementById('auto-loading-percentage');
    const textEl = document.getElementById('auto-loading-text');

    if (progressBar) progressBar.style.width = progress + '%';
    if (percentageEl) percentageEl.textContent = progress + '%';
    if (textEl) textEl.textContent = currentStage;
  }

  // 自动完成阶段
  function autoCompleteStage() {
    if (completedStages < stages.length) {
      const stage = stages[completedStages];
      completedStages++;
      currentStage = stage.text;
      updateProgress();

      // 如果所有阶段都完成，准备隐藏
      if (completedStages >= stages.length) {
        currentStage = '加载完成！';
        updateProgress();
        scheduleHide();
      }
    }
  }

  // 计划隐藏加载界面
  function scheduleHide() {
    if (hideTimer) clearTimeout(hideTimer);

    // 确保最少显示1.5秒
    const elapsedTime = Date.now() - startTime;
    const minDisplayTime = 1500;
    const remainingTime = Math.max(500, minDisplayTime - elapsedTime);

    hideTimer = setTimeout(() => {
      hideLoading();
    }, remainingTime);
  }

  // 隐藏加载界面
  function hideLoading() {
    if (!overlay || !isVisible) return;

    overlay.classList.add('fade-out');
    isVisible = false;

    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
        overlay = null;
      }
    }, 300);

    // 清理定时器
    if (autoStageTimer) {
      clearInterval(autoStageTimer);
      autoStageTimer = null;
    }
  }

  // 智能检测Vue应用渲染状态
  function detectVueApp() {
    const checkInterval = 100;
    let checkCount = 0;
    const maxChecks = 120; // 最多检查12秒
    let contentFoundTime = null;
    const isFirstLoad = !sessionStorage.getItem('app-loaded-before');

    const detector = setInterval(() => {
      checkCount++;

      // 多层次检测Vue应用渲染状态
      const appElement = document.getElementById('app');

      if (appElement) {
        // 1. 检查是否有子元素
        const hasChildren = appElement.children.length > 0;

        // 2. 检查是否有实际的文本内容或可见元素
        const hasVisibleContent = appElement.textContent.trim().length > 0 ||
                                 appElement.querySelectorAll('*').length > 2;

        // 3. 检查是否有导航菜单或主要内容区域
        const hasNavigation = appElement.querySelector('nav, .n-layout-sider, .layout-sider');
        const hasMainContent = appElement.querySelector('main, .n-layout-content, .layout-content, .page-container');

        // 4. 检查是否有具体的页面内容（文字、图片、表单等）
        const hasActualContent = appElement.querySelector('p, h1, h2, h3, h4, h5, h6, img, button, input, .n-button, .content');

        // 5. 检查元素是否真正可见（非display:none或visibility:hidden）
        const isVisible = window.getComputedStyle(appElement).display !== 'none' &&
                         window.getComputedStyle(appElement).visibility !== 'hidden';

        // 6. 检查内容区域的实际尺寸
        const hasReasonableSize = appElement.offsetHeight > 200 && appElement.offsetWidth > 200;

        // 综合判断：应用已挂载且有实际内容
        const isAppReady = hasChildren && hasVisibleContent && isVisible && hasReasonableSize &&
                          (hasNavigation || hasMainContent || hasActualContent);

        if (isAppReady) {
          // 根据首次加载还是刷新调整等待时间
          const stabilityDelay = isFirstLoad ? 500 : 200; // 首次加载等待更久

          if (!contentFoundTime) {
            contentFoundTime = Date.now();
          } else if (Date.now() - contentFoundTime >= stabilityDelay) {
            // 内容稳定显示后才完成加载
            currentStage = '页面渲染完成！';
            updateProgress();

            // 标记已加载过
            sessionStorage.setItem('app-loaded-before', 'true');

            // 快速完成剩余阶段
            setTimeout(() => {
              while (completedStages < stages.length) {
                autoCompleteStage();
              }
            }, 200);

            clearInterval(detector);
            return;
          }
        } else {
          // 如果状态变化，重置计时器
          contentFoundTime = null;
        }
      }

      // 超时处理 - 确保加载动画不会无限显示
      if (checkCount >= maxChecks) {
        console.warn('Vue app detection timed out, forcing completion');
        sessionStorage.setItem('app-loaded-before', 'true');
        while (completedStages < stages.length) {
          autoCompleteStage();
        }
        clearInterval(detector);
      }
    }, checkInterval);

    // 额外的保险机制：监听Vue的渲染完成事件
    const checkVueMount = () => {
      // 检查是否有Vue实例的迹象
      if (window.Vue || document.querySelector('[data-v-]') ||
          document.querySelector('.n-config-provider, .naive-ui')) {
        // 发现Vue组件渲染的迹象，延迟一段时间后完成
        const vueDelay = isFirstLoad ? 1000 : 500;
        setTimeout(() => {
          if (isVisible) {
            while (completedStages < stages.length) {
              autoCompleteStage();
            }
          }
        }, vueDelay);
      }
    };

    // 延迟检查Vue挂载
    const mountCheckDelay = isFirstLoad ? 4000 : 2000;
    setTimeout(checkVueMount, mountCheckDelay);
  }

  // 初始化
  function init() {
    // 立即显示加载界面
    createLoadingOverlay();

    // 开始自动进度
    autoCompleteStage(); // DOM ready

    // 定时自动完成前几个阶段
    let stageIndex = 1;
    autoStageTimer = setInterval(() => {
      if (stageIndex < 6 && completedStages < 6) { // 前6个阶段自动完成
        autoCompleteStage();
        stageIndex++;
      }
    }, 400);

    // 启动Vue应用检测
    setTimeout(() => {
      detectVueApp();
    }, 2000);

    // 监听window.load事件作为最终保险
    window.addEventListener('load', () => {
      setTimeout(() => {
        while (completedStages < stages.length) {
          autoCompleteStage();
        }
      }, 500);
    });
  }

  // DOM准备就绪时开始
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 暴露最小化的全局API（可选）
  window.AutoLoading = {
    hide: hideLoading,
    isVisible: () => isVisible
  };
})();
</script>`

      return html.replace('<head>', `<head>${loadingHtml}`)
    },
  }
}
