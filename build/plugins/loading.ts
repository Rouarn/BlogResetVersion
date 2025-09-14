/**
 * Vite 插件：现代化加载动画插件 v4.0
 *
 * 全新架构设计：
 * - 🎯 Vue生命周期集成：基于Vue应用生命周期的精确控制
 * - 🚀 事件驱动：通过自定义事件与Vue应用通信
 * - 📦 零依赖检测：不依赖DOM结构检测，避免时机问题
 * - 🔍 智能状态管理：基于Promise的异步状态控制
 * - ⚡ 高性能：最小化DOM操作，优化渲染性能
 * - 🎨 现代设计：使用最新CSS特性和动画技术
 *
 * @author Rouarn
 * @version 4.0.0
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
  /** 显示配置 */
  display?: {
    minShowTime?: number
    showProgress?: boolean
    showStages?: boolean
    autoHide?: boolean
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
      exitDuration: 800,
    },
    display: {
      minShowTime: 1500,
      showProgress: true,
      showStages: true,
      autoHide: true,
    },
  }

  // 合并配置
  const config = {
    ...defaultConfig,
    ...userConfig,
    theme: { ...defaultConfig.theme, ...userConfig.theme },
    animation: { ...defaultConfig.animation, ...userConfig.animation },
    display: { ...defaultConfig.display, ...userConfig.display },
  }

  if (!config.enabled) {
    return { name: 'modern-loading-disabled' }
  }

  return {
    name: 'modern-loading-plugin-v4',
    transformIndexHtml(html: string) {
      const loadingSystem = `
<!-- 现代化加载系统 v4.0 -->
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

  .modern-loading-v4 {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999;
    background: var(--loading-bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: system-ui, -apple-system, sans-serif;
    opacity: 1;
    visibility: visible;
    transition: opacity var(--loading-exit-duration) var(--loading-easing),
                visibility var(--loading-exit-duration) var(--loading-easing),
                transform var(--loading-exit-duration) var(--loading-easing);
    transform: scale(1);
    overflow: hidden;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .modern-loading-v4.exiting {
    opacity: 0;
    visibility: hidden;
    transform: scale(0.95);
  }

  .loading-content-v4 {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    text-align: center;
    max-width: 90vw;
    animation: fadeInUp 0.6s var(--loading-easing) forwards;
  }

  .loading-visual-v4 {
    position: relative;
    width: clamp(140px, 18vw, 220px);
    height: clamp(140px, 18vw, 220px);
  }

  .loading-rings-v4 {
    position: absolute;
    inset: 0;
  }

  .loading-ring-v4 {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 4px solid transparent;
    animation: rotate var(--loading-duration) linear infinite;
  }

  .loading-ring-v4:nth-child(1) {
    border-top-color: var(--loading-primary);
    border-right-color: var(--loading-primary);
    animation-duration: 2.5s;
    filter: drop-shadow(0 0 25px var(--loading-primary));
    opacity: 0.9;
  }

  .loading-ring-v4:nth-child(2) {
    border-bottom-color: var(--loading-secondary);
    border-left-color: var(--loading-secondary);
    animation-duration: 2s;
    animation-direction: reverse;
    inset: 12%;
    filter: drop-shadow(0 0 20px var(--loading-secondary));
    opacity: 0.8;
  }

  .loading-ring-v4:nth-child(3) {
    border-top-color: var(--loading-accent);
    border-bottom-color: var(--loading-accent);
    animation-duration: 1.5s;
    inset: 25%;
    filter: drop-shadow(0 0 15px var(--loading-accent));
    opacity: 0.7;
  }

  .loading-core-v4 {
    position: absolute;
    inset: 35%;
    background: radial-gradient(circle, var(--loading-primary), transparent 70%);
    border-radius: 50%;
    animation: pulse 2.5s ease-in-out infinite;
  }

  .loading-info-v4 {
    color: var(--loading-text);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .loading-stage-v4 {
    font-size: clamp(1.1rem, 3vw, 1.4rem);
    font-weight: 600;
    min-height: 1.8em;
    opacity: 0.95;
    letter-spacing: 0.5px;
    transition: all 0.3s var(--loading-easing);
  }

  .loading-progress-container-v4 {
    width: 100%;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .loading-progress-bar-v4 {
    width: 100%;
    height: 6px;
    background: var(--loading-surface);
    border-radius: 3px;
    overflow: hidden;
    position: relative;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
  }

  .loading-progress-fill-v4 {
    height: 100%;
    background: linear-gradient(90deg, var(--loading-primary), var(--loading-secondary), var(--loading-accent));
    background-size: 200% 100%;
    border-radius: 3px;
    width: 0%;
    transition: width 0.4s var(--loading-easing);
    position: relative;
    animation: gradientShift 3s ease-in-out infinite;
  }

  .loading-progress-fill-v4::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    animation: shimmer 2.5s infinite;
  }

  .loading-percentage-v4 {
    font-size: 0.95rem;
    opacity: 0.85;
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }

  .loading-tips-v4 {
    margin-top: 1rem;
    font-size: 0.85rem;
    opacity: 0.6;
    max-width: 280px;
    line-height: 1.4;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes rotate {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.4;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @media (max-width: 768px) {
    .loading-content-v4 {
      gap: 1.5rem;
    }
    .loading-tips-v4 {
      font-size: 0.8rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loading-ring-v4 {
      animation-duration: 6s;
    }
    .loading-core-v4 {
      animation: none;
      opacity: 0.7;
    }
    .loading-progress-fill-v4::after,
    .loading-progress-fill-v4 {
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
    { id: 'init', text: '初始化应用环境...', weight: 15, tips: '正在准备运行环境' },
    { id: 'modules', text: '加载核心模块...', weight: 20, tips: '导入必要的依赖库' },
    { id: 'vue', text: '启动Vue应用...', weight: 25, tips: '创建应用实例' },
    { id: 'router', text: '配置路由系统...', weight: 15, tips: '初始化页面路由' },
    { id: 'store', text: '初始化状态管理...', weight: 10, tips: '准备数据存储' },
    { id: 'render', text: '渲染用户界面...', weight: 15, tips: '构建页面内容' }
  ];

  /**
   * 现代化加载管理器 v4.0
   */
  class ModernLoadingManagerV4 {
    constructor() {
      this.state = {
        isActive: false,
        isExiting: false,
        startTime: Date.now(),
        currentStage: 0,
        progress: 0,
        isAppReady: false,
        readyPromise: null,
        readyResolve: null
      };

      this.elements = {
        container: null,
        stage: null,
        progressFill: null,
        percentage: null,
        tips: null
      };

      this.timers = new Set();
      this.eventListeners = new Set();

      this.init();
    }

    /**
     * 初始化加载系统
     */
    init() {
      this.createReadyPromise();
      this.createUI();
      this.startStageProgression();
      this.setupEventListeners();
      this.setupGlobalAPI();
    }

    /**
     * 创建准备就绪Promise
     */
    createReadyPromise() {
      this.state.readyPromise = new Promise((resolve) => {
        this.state.readyResolve = resolve;
      });
    }

    /**
     * 创建用户界面
     */
    createUI() {
      const container = document.createElement('div');
      container.className = 'modern-loading-v4';

      const content = document.createElement('div');
      content.className = 'loading-content-v4';

      // 创建视觉元素
      const visual = document.createElement('div');
      visual.className = 'loading-visual-v4';

      const rings = document.createElement('div');
      rings.className = 'loading-rings-v4';
      for (let i = 0; i < 3; i++) {
        const ring = document.createElement('div');
        ring.className = 'loading-ring-v4';
        rings.appendChild(ring);
      }

      const core = document.createElement('div');
      core.className = 'loading-core-v4';

      visual.appendChild(rings);
      visual.appendChild(core);

      // 创建信息元素
      const info = document.createElement('div');
      info.className = 'loading-info-v4';

      const stage = document.createElement('div');
      stage.className = 'loading-stage-v4';
      stage.textContent = '初始化应用环境...';
      info.appendChild(stage);

      // 声明进度条相关元素
      let progressFill = null;
      let percentage = null;

      // 创建进度条
      if (CONFIG.display.showProgress) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'loading-progress-container-v4';

        const progressBar = document.createElement('div');
        progressBar.className = 'loading-progress-bar-v4';

        progressFill = document.createElement('div');
        progressFill.className = 'loading-progress-fill-v4';

        percentage = document.createElement('div');
        percentage.className = 'loading-percentage-v4';
        percentage.textContent = '0%';

        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(percentage);
        info.appendChild(progressContainer);
      }

      // 创建提示文本
      const tips = document.createElement('div');
      tips.className = 'loading-tips-v4';
      tips.textContent = '正在准备运行环境';
      info.appendChild(tips);

      content.appendChild(visual);
      content.appendChild(info);
      container.appendChild(content);

      document.body.appendChild(container);

      // 缓存元素引用
      this.elements.container = container;
      this.elements.stage = stage;
      this.elements.progressFill = progressFill;
      this.elements.percentage = percentage;
      this.elements.tips = tips;

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

          if (this.elements.tips) {
            this.elements.tips.textContent = stage.tips;
          }

          // 计算进度
          const totalWeight = STAGES.reduce((sum, s) => sum + s.weight, 0);
          const completedWeight = STAGES.slice(0, this.state.currentStage + 1)
            .reduce((sum, s) => sum + s.weight, 0);

          this.updateProgress(Math.min(90, (completedWeight / totalWeight) * 100));

          this.state.currentStage++;

          // 调度下一个阶段
          const delay = 400 + Math.random() * 600; // 400-1000ms随机延迟
          const timer = setTimeout(progressStage, delay);
          this.timers.add(timer);
        }
      };

      // 开始第一个阶段
      const timer = setTimeout(progressStage, 300);
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
     * 设置事件监听器
     */
    setupEventListeners() {
      // 监听Vue应用准备就绪事件
      const onAppReady = () => {
        if (!this.state.isAppReady) {
          this.onAppReady();
        }
      };

      // 监听自定义事件
      const readyListener = (event) => onAppReady();
      document.addEventListener('vue-app-ready', readyListener);
      document.addEventListener('app-mounted', readyListener);
      window.addEventListener('app-ready', readyListener);
      this.eventListeners.add(() => {
        document.removeEventListener('vue-app-ready', readyListener);
        document.removeEventListener('app-mounted', readyListener);
        window.removeEventListener('app-ready', readyListener);
      });

      // 页面加载完成后的延迟检查
      const onLoad = () => {
        const timer = setTimeout(() => {
          if (!this.state.isAppReady) {
            // 检查是否有Vue应用实例
            if (window.Vue || window.__VUE__ || document.querySelector('[data-v-]') || document.querySelector('.vue-app')) {
              this.onAppReady();
            }
          }
        }, 2000);
        this.timers.add(timer);
      };

      if (document.readyState === 'complete') {
        onLoad();
      } else {
        window.addEventListener('load', onLoad, { once: true });
      }

      // 页面可见性变化
      const visibilityListener = () => {
        if (document.visibilityState === 'visible' && !this.state.isAppReady) {
          const timer = setTimeout(() => {
            if (!this.state.isAppReady) {
              this.onAppReady();
            }
          }, 1000);
          this.timers.add(timer);
        }
      };
      document.addEventListener('visibilitychange', visibilityListener);
      this.eventListeners.add(() => {
        document.removeEventListener('visibilitychange', visibilityListener);
      });
    }

    /**
     * 设置全局API
     */
    setupGlobalAPI() {
      const api = {
        ready: () => this.onAppReady(),
        hide: () => this.onAppReady(),
        setProgress: (progress) => this.updateProgress(progress),
        setStage: (text, tips) => {
          if (this.elements.stage) this.elements.stage.textContent = text;
          if (this.elements.tips && tips) this.elements.tips.textContent = tips;
        },
        getState: () => ({ ...this.state }),
        isActive: () => this.state.isActive,
        whenReady: () => this.state.readyPromise
      };

      // 设置两种API方式以确保兼容性
      window.$loading = api;
    }

    /**
     * 应用准备就绪回调
     */
    onAppReady() {
      if (this.state.isAppReady) return;

      this.state.isAppReady = true;

      // 更新显示
      if (this.elements.stage) {
        this.elements.stage.textContent = '应用加载完成！';
      }
      if (this.elements.tips) {
        this.elements.tips.textContent = '即将进入应用界面';
      }

      this.updateProgress(100);

      // 解析准备就绪Promise
      if (this.state.readyResolve) {
        this.state.readyResolve();
      }

      // 确保最小显示时间
      const elapsedTime = Date.now() - this.state.startTime;
      const remainingTime = Math.max(0, CONFIG.display.minShowTime - elapsedTime);

      const timer = setTimeout(() => {
        if (CONFIG.display.autoHide) {
          this.startExitAnimation();
        }
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
      if (this.elements.tips) {
        this.elements.tips.textContent = '欢迎使用！';
      }

      // 开始退出动画
      const timer = setTimeout(() => {
        if (this.elements.container) {
          this.elements.container.classList.add('exiting');

          const cleanupTimer = setTimeout(() => {
            this.cleanup();
          }, CONFIG.animation.exitDuration);

          this.timers.add(cleanupTimer);
        }
      }, 600);

      this.timers.add(timer);
    }

    /**
     * 清理资源
     */
    cleanup() {
      // 清理定时器
      this.timers.forEach(timer => clearTimeout(timer));
      this.timers.clear();

      // 清理事件监听器
      this.eventListeners.forEach(cleanup => cleanup());
      this.eventListeners.clear();

      // 移除DOM元素
      if (this.elements.container && this.elements.container.parentNode) {
        this.elements.container.parentNode.removeChild(this.elements.container);
      }

      // 清理引用
      this.elements = {};
      this.state.isActive = false;

      // 清理全局API
      if (window.$loading) {
        delete window.$loading;
      }
    }
  }

  // 初始化加载管理器
  let loadingManager = null;

  const initLoading = () => {
    if (!loadingManager) {
      loadingManager = new ModernLoadingManagerV4();
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
