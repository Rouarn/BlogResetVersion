/**
 * Vite 插件：完全自动化的加载动画插件
 *
 * 特性：
 * - 🚀 零入侵：无需修改业务代码，自动检测应用状态
 * - 🎯 智能检测：多层次检测Vue应用渲染完成状态
 * - 🎨 高度可配置：支持主题、进度、检测参数等全面配置
 * - 📱 响应式设计：自适应桌面端和移动端显示
 *
 * 使用方法：
 * ```typescript
 * import { setupLoadingPlugin } from './build/plugins/loading'
 *
 * export default defineConfig({
 *   plugins: [
 *     setupLoadingPlugin({
 *       enabled: true,
 *       theme: { primary: '#4bc0c8' },
 *       minDisplayTime: 1500
 *     })
 *   ]
 * })
 * ```
 *
 * @author Rouarn
 * @version 1.0.0
 */

import type { PluginOption } from 'vite'

/**
 * 加载动画插件配置接口
 *
 * @interface LoadingConfig
 * @description 提供完整的加载动画自定义配置选项
 */
interface LoadingConfig {
  /** 是否启用加载动画 */
  enabled?: boolean
  /** 最小显示时间（毫秒） */
  minDisplayTime?: number
  /** 淡出动画时间（毫秒） */
  fadeOutDuration?: number
  /** 主题颜色配置 */
  theme?: {
    /** 主色调 */
    primary?: string
    /** 次要色调 */
    secondary?: string
    /** 第三色调 */
    tertiary?: string
    /** 背景色 */
    background?: string
    /** 文字颜色 */
    textColor?: string
  }
  /** 检测配置 */
  detection?: {
    /** 检测间隔（毫秒） */
    checkInterval?: number
    /** 最大检测次数 */
    maxChecks?: number
    /** 首次加载稳定延迟（毫秒） */
    firstLoadDelay?: number
    /** 刷新加载稳定延迟（毫秒） */
    refreshDelay?: number
    /** Vue挂载检查延迟（毫秒） */
    vueCheckDelay?: number
  }
  /** 进度配置 */
  progress?: {
    /** 自动阶段间隔（毫秒） */
    stageInterval?: number
    /** 自动完成的阶段数量 */
    autoStageCount?: number
    /** 自定义加载阶段 */
    customStages?: Array<{ name: string; text: string }>
  }
  /** 响应式配置 */
  responsive?: {
    /** 移动端加载器尺寸 */
    mobileSize?: number
    /** 桌面端加载器尺寸 */
    desktopSize?: number
  }
}

/**
 * 创建并配置加载动画插件
 *
 * @param {LoadingConfig} config - 加载动画配置选项
 * @param {boolean} [config.enabled=true] - 是否启用加载动画
 * @param {number} [config.minDisplayTime=1500] - 最小显示时间（毫秒）
 * @param {number} [config.fadeOutDuration=300] - 淡出动画时间（毫秒）
 * @param {object} [config.theme] - 主题颜色配置
 * @param {object} [config.detection] - 检测配置
 * @param {object} [config.progress] - 进度配置
 * @param {object} [config.responsive] - 响应式配置
 *
 * @returns {PluginOption} Vite插件选项
 *
 * @example
 * ```typescript
 * // 基础使用
 * setupLoadingPlugin()
 *
 * // 自定义配置
 * setupLoadingPlugin({
 *   enabled: true,
 *   minDisplayTime: 2000,
 *   theme: {
 *     primary: '#ff6b6b',
 *     secondary: '#4ecdc4',
 *     background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
 *   },
 *   detection: {
 *     checkInterval: 50,
 *     maxChecks: 200
 *   }
 * })
 * ```
 *
 * @since 1.0.0
 * @author Rouarn
 */
export function setupLoadingPlugin(config: LoadingConfig = {}): PluginOption {
  // 合并默认配置
  const defaultConfig: Required<LoadingConfig> = {
    enabled: true,
    minDisplayTime: 1500,
    fadeOutDuration: 300,
    theme: {
      primary: '#4bc0c8',
      secondary: '#c779d0',
      tertiary: '#feac5e',
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)',
      textColor: '#ffffff',
    },
    detection: {
      checkInterval: 100,
      maxChecks: 120,
      firstLoadDelay: 500,
      refreshDelay: 200,
      vueCheckDelay: 2000,
    },
    progress: {
      stageInterval: 400,
      autoStageCount: 6,
      customStages: [
        { name: 'dom-ready', text: '正在加载DOM...' },
        { name: 'scripts', text: '正在加载脚本...' },
        { name: 'styles', text: '正在加载样式...' },
        { name: 'vue-app', text: '正在初始化Vue应用...' },
        { name: 'router', text: '正在初始化路由...' },
        { name: 'store', text: '正在初始化状态管理...' },
        { name: 'plugins', text: '正在加载插件...' },
        { name: 'mount', text: '正在挂载应用...' },
        { name: 'render', text: '正在渲染页面...' },
      ],
    },
    responsive: {
      mobileSize: 120,
      desktopSize: 180,
    },
  }

  const finalConfig = {
    ...defaultConfig,
    ...config,
    theme: { ...defaultConfig.theme, ...config.theme },
    detection: { ...defaultConfig.detection, ...config.detection },
    progress: { ...defaultConfig.progress, ...config.progress },
    responsive: { ...defaultConfig.responsive, ...config.responsive },
  }

  // 如果禁用，返回空插件
  if (!finalConfig.enabled) {
    return { name: 'auto-loading-plugin-disabled' }
  }

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
  background: ${finalConfig.theme.background};
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 1;
  transition: opacity ${finalConfig.fadeOutDuration}ms ease-in-out;
}

.auto-loading-overlay.fade-out {
  opacity: 0;
}

.auto-loader {
  width: ${finalConfig.responsive.desktopSize}px;
  height: ${finalConfig.responsive.desktopSize}px;
  position: relative;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: ${finalConfig.theme.primary};
  animation: auto-spin 2s linear infinite;
  box-shadow: 0 0 30px ${finalConfig.theme.primary}4D;
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
  border-top-color: ${finalConfig.theme.secondary};
  animation: auto-spin 3s linear infinite;
  box-shadow: 0 0 20px ${finalConfig.theme.secondary}4D;
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
  border-top-color: ${finalConfig.theme.tertiary};
  animation: auto-spin 1.5s linear infinite;
  box-shadow: 0 0 15px ${finalConfig.theme.tertiary}4D;
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
  background-color: ${finalConfig.theme.primary};
  border-radius: 2px;
  transition: width 0.3s ease-out;
  box-shadow: 0 0 10px ${finalConfig.theme.primary}99;
}

.auto-loading-percentage {
  position: absolute;
  bottom: 110px;
  color: ${finalConfig.theme.primary};
  font-size: 14px;
  font-weight: 600;
}

.auto-loading-text {
  position: absolute;
  bottom: 80px;
  color: ${finalConfig.theme.textColor};
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
  .auto-loader { width: ${finalConfig.responsive.mobileSize}px; height: ${finalConfig.responsive.mobileSize}px; }
  .auto-loader::before { left: 8px; top: 8px; right: 8px; bottom: 8px; }
  .auto-loader::after { left: 18px; top: 18px; right: 18px; bottom: 18px; }
  .auto-loading-text { font-size: 14px; bottom: 60px; }
}
</style>

<script>
// 完全自动化的加载管理器
(function() {
  'use strict';

  // 注入的配置
  const config = ${JSON.stringify(finalConfig)};

  let startTime = Date.now();
  let progress = 0;
  let currentStage = '正在初始化应用...';
  let overlay = null;
  let isVisible = false;

  const stages = config.progress.customStages;

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

    // 确保最少显示配置的时间
    const elapsedTime = Date.now() - startTime;
    const minDisplayTime = config.minDisplayTime;
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
    }, config.fadeOutDuration);

    // 清理定时器
    if (autoStageTimer) {
      clearInterval(autoStageTimer);
      autoStageTimer = null;
    }
  }

  // 智能检测Vue应用渲染状态
  function detectVueApp() {
    const checkInterval = config.detection.checkInterval;
    let checkCount = 0;
    const maxChecks = config.detection.maxChecks;
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
        const hasVisibleContent = (appElement.textContent?.trim().length || 0) > 0 ||
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
          const stabilityDelay = isFirstLoad ? config.detection.firstLoadDelay : config.detection.refreshDelay;

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
        const vueDelay = isFirstLoad ? config.detection.firstLoadDelay * 2 : config.detection.refreshDelay * 2.5;
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
    const mountCheckDelay = config.detection.vueCheckDelay;
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
      if (stageIndex < config.progress.autoStageCount && completedStages < config.progress.autoStageCount) {
        autoCompleteStage();
        stageIndex++;
      }
    }, config.progress.stageInterval);

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
