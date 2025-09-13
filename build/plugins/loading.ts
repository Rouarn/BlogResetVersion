/**
 * Vite 插件：现代化加载动画插件 v3.0
 *
 * 全新架构设计：
 * - 🎯 观察者模式：基于事件驱动的状态管理
 * - 🚀 现代CSS：使用CSS变量、Grid布局和现代动画
 * - 📦 模块化设计：分离关注点，易于维护和扩展
 * - 🔍 智能检测：基于MutationObserver的实时检测
 * - ⚡ 高性能：RAF优化，避免强制重排
 * - 🎨 响应式：完全响应式设计，支持所有设备
 *
 * @author Rouarn
 * @version 3.0.0
 */

import type { PluginOption } from 'vite'

/**
 * 加载插件配置接口
 */
interface LoadingPluginConfig {
  /** 是否启用 */
  enabled?: boolean
  /** 主题配置 */
  theme?: {
    primary?: string
    secondary?: string
    accent?: string
    background?: string
    surface?: string
    text?: string
  }
  /** 动画配置 */
  animation?: {
    duration?: number
    easing?: string
    exitDuration?: number
  }
  /** 检测配置 */
  detection?: {
    timeout?: number
    debounce?: number
    minStableTime?: number
  }
  /** 显示配置 */
  display?: {
    minShowTime?: number
    showProgress?: boolean
    showStages?: boolean
  }
}

/**
 * 创建现代化加载插件
 */
export function setupLoadingPlugin(userConfig: LoadingPluginConfig = {}): PluginOption {
  // 默认配置
  const defaultConfig: Required<LoadingPluginConfig> = {
    enabled: true,
    theme: {
      primary: 'hsl(200, 100%, 60%)',
      secondary: 'hsl(280, 100%, 70%)',
      accent: 'hsl(45, 100%, 65%)',
      background: 'hsl(220, 30%, 8%)',
      surface: 'hsl(220, 25%, 12%)',
      text: 'hsl(0, 0%, 95%)',
    },
    animation: {
      duration: 800,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      exitDuration: 600,
    },
    detection: {
      timeout: 10000,
      debounce: 150,
      minStableTime: 300,
    },
    display: {
      minShowTime: 1200,
      showProgress: true,
      showStages: true,
    },
  }

  // 合并配置
  const config = {
    ...defaultConfig,
    ...userConfig,
    theme: { ...defaultConfig.theme, ...userConfig.theme },
    animation: { ...defaultConfig.animation, ...userConfig.animation },
    detection: { ...defaultConfig.detection, ...userConfig.detection },
    display: { ...defaultConfig.display, ...userConfig.display },
  }

  if (!config.enabled) {
    return { name: 'modern-loading-disabled' }
  }

  return {
    name: 'modern-loading-plugin',
    transformIndexHtml(html: string) {
      const loadingSystem = `
<!-- 现代化加载系统 v3.0 -->
<style>
  :root {
    --loading-primary: ${config.theme.primary};
    --loading-secondary: ${config.theme.secondary};
    --loading-accent: ${config.theme.accent};
    --loading-bg: ${config.theme.background};
    --loading-surface: ${config.theme.surface};
    --loading-text: ${config.theme.text};
    --loading-duration: ${config.animation.duration}ms;
    --loading-easing: ${config.animation.easing};
    --loading-exit-duration: ${config.animation.exitDuration}ms;
  }

  /* 加载动画覆盖滚动条区域 */
  .modern-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999;
    background: var(--loading-bg);
    display: grid;
    place-items: center;
    font-family: system-ui, -apple-system, sans-serif;
    opacity: 1;
    visibility: visible;
    transition: opacity var(--loading-exit-duration) var(--loading-easing),
                visibility var(--loading-exit-duration) var(--loading-easing);
    overflow: hidden;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .modern-loading.hidden {
    opacity: 0;
    visibility: hidden;
  }

  .loading-content {
    display: grid;
    gap: 2rem;
    text-align: center;
    max-width: 90vw;
  }

  .loading-visual {
    position: relative;
    width: clamp(120px, 15vw, 200px);
    height: clamp(120px, 15vw, 200px);
    margin: 0 auto;
  }

  .loading-rings {
    position: absolute;
    inset: 0;
  }

  .loading-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid transparent;
    animation: rotate var(--loading-duration) linear infinite;
  }

  .loading-ring:nth-child(1) {
    border-top-color: var(--loading-primary);
    animation-duration: 2s;
    filter: drop-shadow(0 0 20px var(--loading-primary));
  }

  .loading-ring:nth-child(2) {
    border-right-color: var(--loading-secondary);
    animation-duration: 1.5s;
    animation-direction: reverse;
    inset: 15%;
    filter: drop-shadow(0 0 15px var(--loading-secondary));
  }

  .loading-ring:nth-child(3) {
    border-bottom-color: var(--loading-accent);
    animation-duration: 1s;
    inset: 30%;
    filter: drop-shadow(0 0 10px var(--loading-accent));
  }

  .loading-core {
    position: absolute;
    inset: 40%;
    background: radial-gradient(circle, var(--loading-primary), transparent);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  .loading-info {
    color: var(--loading-text);
  }

  .loading-stage {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    font-weight: 500;
    margin-bottom: 0.5rem;
    min-height: 1.5em;
    opacity: 0.9;
  }

  .loading-progress-container {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }

  .loading-progress-bar {
    width: 100%;
    height: 4px;
    background: var(--loading-surface);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }

  .loading-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--loading-primary), var(--loading-secondary));
    border-radius: 2px;
    width: 0%;
    transition: width 0.3s var(--loading-easing);
    position: relative;
    overflow: hidden;
  }

  .loading-progress-fill::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 2s infinite;
  }

  .loading-percentage {
    font-size: 0.875rem;
    margin-top: 0.5rem;
    opacity: 0.8;
    font-variant-numeric: tabular-nums;
  }

  /* 简单的淡出过渡效果 */
  .modern-loading {
    transition: opacity 0.3s ease;
  }

  @keyframes rotate {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.6; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1); }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @media (max-width: 768px) {
    .loading-content {
      gap: 1.5rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loading-ring {
      animation-duration: 4s;
    }
    .loading-core {
      animation: none;
    }
    .loading-progress-fill::after {
      animation: none;
    }
  }
</style>

<script>
(function() {
  'use strict';

  // 配置
  const CONFIG = ${JSON.stringify(config)};

  // 加载阶段定义
  const STAGES = [
    { id: 'init', text: '初始化应用...', weight: 10 },
    { id: 'dom', text: '构建DOM结构...', weight: 15 },
    { id: 'assets', text: '加载资源文件...', weight: 20 },
    { id: 'scripts', text: '执行脚本...', weight: 15 },
    { id: 'vue', text: '启动Vue应用...', weight: 20 },
    { id: 'router', text: '初始化路由...', weight: 10 },
    { id: 'render', text: '渲染页面内容...', weight: 10 }
  ];

  /**
   * 现代化加载管理器
   */
  class ModernLoadingManager {
    constructor() {
      this.state = {
        isActive: false,
        isExiting: false,
        startTime: Date.now(),
        currentStage: 0,
        progress: 0,
        isAppReady: false
      };

      this.elements = {
        container: null,
        stage: null,
        progressFill: null,
        percentage: null
      };

      this.timers = new Set();
      this.observers = new Set();

      this.init();
    }

    /**
     * 初始化加载系统
     */
    init() {
      this.createUI();
      this.startStageProgression();
      this.startAppDetection();
      this.setupEventListeners();
    }

    /**
     * 创建用户界面
     */
    createUI() {
      // 主加载界面
      const container = document.createElement('div');
      container.className = 'modern-loading';

      // 创建内容容器
      const content = document.createElement('div');
      content.className = 'loading-content';

      // 创建视觉元素
      const visual = document.createElement('div');
      visual.className = 'loading-visual';

      const rings = document.createElement('div');
      rings.className = 'loading-rings';
      for (let i = 0; i < 3; i++) {
        const ring = document.createElement('div');
        ring.className = 'loading-ring';
        rings.appendChild(ring);
      }

      const core = document.createElement('div');
      core.className = 'loading-core';

      visual.appendChild(rings);
      visual.appendChild(core);

      // 创建信息元素
      const info = document.createElement('div');
      info.className = 'loading-info';

      const stage = document.createElement('div');
      stage.className = 'loading-stage';
      stage.textContent = '初始化应用...';
      info.appendChild(stage);

      // 创建进度条（如果启用）
      if (CONFIG.display.showProgress) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'loading-progress-container';

        const progressBar = document.createElement('div');
        progressBar.className = 'loading-progress-bar';

        const progressFill = document.createElement('div');
        progressFill.className = 'loading-progress-fill';

        const percentage = document.createElement('div');
        percentage.className = 'loading-percentage';
        percentage.textContent = '0%';

        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(percentage);
        info.appendChild(progressContainer);
      }

      content.appendChild(visual);
      content.appendChild(info);
      container.appendChild(content);

      document.body.appendChild(container);

      // 缓存元素引用
      this.elements.container = container;
      this.elements.stage = container.querySelector('.loading-stage');
      this.elements.progressFill = container.querySelector('.loading-progress-fill');
      this.elements.percentage = container.querySelector('.loading-percentage');

      this.state.isActive = true;
    }

    /**
     * 开始阶段进展
     */
    startStageProgression() {
      const progressStage = () => {
        if (this.state.currentStage < STAGES.length && !this.state.isAppReady) {
          const stage = STAGES[this.state.currentStage];

          // 更新显示
          if (CONFIG.display.showStages && this.elements.stage) {
            this.elements.stage.textContent = stage.text;
          }

          // 计算进度
          const totalWeight = STAGES.reduce((sum, s) => sum + s.weight, 0);
          const completedWeight = STAGES.slice(0, this.state.currentStage + 1)
            .reduce((sum, s) => sum + s.weight, 0);

          this.updateProgress(Math.min(85, (completedWeight / totalWeight) * 100));

          this.state.currentStage++;

          // 调度下一个阶段
          const delay = 300 + Math.random() * 400; // 300-700ms随机延迟
          const timer = setTimeout(progressStage, delay);
          this.timers.add(timer);
        }
      };

      // 开始第一个阶段
      const timer = setTimeout(progressStage, 200);
      this.timers.add(timer);
    }

    /**
     * 更新进度显示
     */
    updateProgress(progress) {
      this.state.progress = Math.min(100, Math.max(0, progress));

      if (this.elements.progressFill) {
        this.elements.progressFill.style.width = this.state.progress + '%';
      }

      if (this.elements.percentage) {
        this.elements.percentage.textContent = Math.round(this.state.progress) + '%';
      }
    }

    /**
     * 开始应用检测
     */
    startAppDetection() {
      let stableTime = null;
      let lastCheck = Date.now();

      const checkAppReady = () => {
        const now = Date.now();

        // 防抖检查
        if (now - lastCheck < CONFIG.detection.debounce) {
          const timer = setTimeout(checkAppReady, CONFIG.detection.debounce);
          this.timers.add(timer);
          return;
        }

        lastCheck = now;

        const appElement = document.getElementById('app');
        if (!appElement) {
          const timer = setTimeout(checkAppReady, CONFIG.detection.debounce);
          this.timers.add(timer);
          return;
        }

        // 检查应用是否准备就绪
        const hasContent = appElement.children.length > 0;
        const hasVisibleContent = appElement.offsetHeight > 100 && appElement.offsetWidth > 100;
        const hasInteractiveElements = appElement.querySelector('button, input, a, [role="button"]');
        const hasNavigation = appElement.querySelector('nav, header, .nav, .header');
        const hasMainContent = appElement.querySelector('main, .main, .content, .page');

        const isReady = hasContent && hasVisibleContent && (hasInteractiveElements || hasNavigation || hasMainContent);

        if (isReady) {
          if (!stableTime) {
            stableTime = now;
          } else if (now - stableTime >= CONFIG.detection.minStableTime) {
            this.onAppReady();
            return;
          }
        } else {
          stableTime = null;
        }

        // 继续检测
        if (!this.state.isAppReady && now - this.state.startTime < CONFIG.detection.timeout) {
          const timer = setTimeout(checkAppReady, CONFIG.detection.debounce);
          this.timers.add(timer);
        } else if (!this.state.isAppReady) {
          // 超时，强制完成
          this.onAppReady();
        }
      };

      // 使用MutationObserver监听DOM变化
      if (window.MutationObserver) {
        const observer = new MutationObserver(() => {
          if (!this.state.isAppReady) {
            checkAppReady();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'style']
        });

        this.observers.add(observer);
      }

      // 开始检测
      const timer = setTimeout(checkAppReady, 1000);
      this.timers.add(timer);
    }

    /**
     * 应用准备就绪回调
     */
    onAppReady() {
      if (this.state.isAppReady) return;

      this.state.isAppReady = true;

      // 更新显示
      if (this.elements.stage) {
        this.elements.stage.textContent = '加载完成！';
      }

      this.updateProgress(100);

      // 确保最小显示时间
      const elapsedTime = Date.now() - this.state.startTime;
      const remainingTime = Math.max(0, CONFIG.display.minShowTime - elapsedTime);

      const timer = setTimeout(() => {
        this.startExitAnimation();
      }, remainingTime);

      this.timers.add(timer);
    }

    /**
     * 开始退出动画
     */
    startExitAnimation() {
      if (this.state.isExiting) return;

      this.state.isExiting = true;

      // 显示退出提示
      if (this.elements.stage) {
        this.elements.stage.textContent = '正在进入应用...';
      }

      // 简单的淡出动画
      const timer = setTimeout(() => {
        if (this.elements.container) {
          this.elements.container.style.opacity = '0';

          const cleanupTimer = setTimeout(() => {
            this.cleanup();
          }, 300);

          this.timers.add(cleanupTimer);
        }
      }, 500);

      this.timers.add(timer);
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
      // 页面加载完成保险
      const onLoad = () => {
        const timer = setTimeout(() => {
          if (!this.state.isAppReady) {
            this.onAppReady();
          }
        }, 1000);
        this.timers.add(timer);
      };

      if (document.readyState === 'complete') {
        onLoad();
      } else {
        window.addEventListener('load', onLoad, { once: true });
      }

      // 页面可见性变化
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !this.state.isAppReady) {
          const timer = setTimeout(() => {
            if (!this.state.isAppReady) {
              this.onAppReady();
            }
          }, 500);
          this.timers.add(timer);
        }
      });
    }

    /**
     * 清理资源
     */
    cleanup() {
      // 清理定时器
      this.timers.forEach(timer => clearTimeout(timer));
      this.timers.clear();

      // 清理观察者
      this.observers.forEach(observer => observer.disconnect());
      this.observers.clear();

      // 移除DOM元素
      if (this.elements.container && this.elements.container.parentNode) {
        this.elements.container.parentNode.removeChild(this.elements.container);
      }

      if (this.elements.exitOverlay && this.elements.exitOverlay.parentNode) {
        this.elements.exitOverlay.parentNode.removeChild(this.elements.exitOverlay);
      }

      // 清理引用
      this.elements = {};
      this.state.isActive = false;
    }

    /**
     * 手动隐藏加载界面
     */
    hide() {
      if (!this.state.isExiting) {
        this.onAppReady();
      }
    }

    /**
     * 获取当前状态
     */
    getState() {
      return { ...this.state };
    }
  }

  // 初始化加载管理器
  let loadingManager = null;

  const initLoading = () => {
    if (!loadingManager) {
      loadingManager = new ModernLoadingManager();

      // 暴露全局API
      window.ModernLoading = {
        hide: () => loadingManager?.hide(),
        getState: () => loadingManager?.getState() || {},
        isActive: () => loadingManager?.state.isActive || false
      };
    }
  };

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoading);
  } else {
    initLoading();
  }
})();
</script>
`

      return html.replace('<head>', '<head>' + loadingSystem)
    },
  }
}
