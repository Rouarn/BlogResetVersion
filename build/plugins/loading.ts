/**
 * Vite 现代化加载插件 v5.0
 * 全新重构版本 - 简洁、高效、美观
 *
 * 核心特性：
 * - 🎨 现代化设计语言
 * - ⚡ 零配置开箱即用
 * - 🚀 智能加载检测
 * - 🎯 流畅动画体验
 * - 📱 完美响应式适配
 *
 * @author Rouarn
 * @version 5.0.0
 */

import type { PluginOption } from 'vite'

interface LoadingConfig {
  /** 是否启用 */
  enabled?: boolean
  /** 最小显示时间(ms) */
  minTime?: number
  /** 主题色 */
  primaryColor?: string
  /** 背景色 */
  backgroundColor?: string
  /** 文本配置 */
  texts?: {
    loading?: string
    complete?: string
  }
}

export function setupLoadingPlugin(config: LoadingConfig = {}): PluginOption {
  const defaultConfig = {
    enabled: true,
    minTime: 600,
    primaryColor: '#3b82f6',
    backgroundColor: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    texts: {
      loading: '正在加载应用...',
      complete: '加载完成',
    },
  }

  const finalConfig = { ...defaultConfig, ...config, texts: { ...defaultConfig.texts, ...config.texts } }

  if (!finalConfig.enabled) {
    return { name: 'loading-disabled' }
  }

  return {
    name: 'modern-loading-v5',
    transformIndexHtml(html: string) {
      const loadingHTML = `
<!-- 现代化加载系统 v5.0 -->
<style>
  .loading-overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999;
    background: ${finalConfig.backgroundColor};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    opacity: 1;
    visibility: visible;
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    will-change: transform, opacity;
    backface-visibility: hidden;
    transform: translateZ(0);
  }

  .loading-overlay::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
                radial-gradient(circle at center, rgba(6, 182, 212, 0.04) 0%, transparent 70%);
    animation: pulseBackground 8s linear infinite;
    will-change: opacity, transform;
    transform: translateZ(0);
  }

  .loading-overlay.door-opening {
    transform-style: preserve-3d;
    perspective: 1000px;
    background: transparent !important;
  }

  .loading-overlay.door-opening::before {
    opacity: 0;
  }

  .loading-overlay.door-opening .door-left,
   .loading-overlay.door-opening .door-right {
     position: absolute;
     top: 0;
     width: 50%;
     height: 100%;
     background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
     z-index: 10;
     transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
   }

   .loading-overlay.door-opening .door-left {
     left: 0;
     transform: translateX(-100%);
     box-shadow: 5px 0 30px rgba(0,0,0,0.4);
   }

   .loading-overlay.door-opening .door-right {
     right: 0;
     transform: translateX(100%);
     box-shadow: -5px 0 30px rgba(0,0,0,0.4);
   }

  .loading-overlay.door-opening .loading-container {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
    transition: all 0.6s ease-out;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 5;
    will-change: transform;
    transform: translateZ(0);
  }

  .loading-container::before {
    content: '';
    position: absolute;
    inset: -60px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, rgba(139, 92, 246, 0.04) 40%, rgba(6, 182, 212, 0.03) 70%, transparent 100%);
    border-radius: 50%;
    animation: breathe 6s linear infinite;
    will-change: transform, opacity;
    transform: translateZ(0);
  }

  .loading-spinner {
    position: relative;
    width: 100px;
    height: 100px;
    animation: float 4s linear infinite;
    will-change: transform;
    transform: translateZ(0);
  }

  .spinner-ring {
    position: absolute;
    inset: 0;
    border: 4px solid transparent;
    border-radius: 50%;
    animation: spin 2s linear infinite;
    will-change: transform;
    transform: translateZ(0);
  }

  .spinner-ring:nth-child(1) {
    border-top-color: ${finalConfig.primaryColor};
    border-right-color: ${finalConfig.primaryColor};
    animation-duration: 1.5s;
    opacity: 0.8;
    border-width: 2px;
    box-shadow: 0 0 6px ${finalConfig.primaryColor}30;
  }

  .spinner-ring:nth-child(2) {
    border-bottom-color: #8b5cf6;
    border-left-color: #8b5cf6;
    animation-duration: 2s;
    animation-direction: reverse;
    inset: 8px;
    opacity: 0.6;
    border-width: 2px;
    box-shadow: 0 0 4px #8b5cf630;
  }

  .spinner-ring:nth-child(3) {
    border-top-color: #06b6d4;
    border-bottom-color: #06b6d4;
    animation-duration: 2.5s;
    inset: 16px;
    opacity: 0.4;
    border-width: 1px;
    box-shadow: 0 0 3px #06b6d430;
  }

  .spinner-ring:nth-child(4) {
    border-right-color: #10b981;
    border-left-color: #10b981;
    animation-duration: 3s;
    animation-direction: reverse;
    inset: 24px;
    opacity: 0.3;
    border-width: 1px;
    box-shadow: 0 0 2px #10b98130;
  }

  .loading-core {
    position: absolute;
    inset: 32px;
    background: radial-gradient(circle, ${finalConfig.primaryColor}20, #8b5cf620, transparent 80%);
    border-radius: 50%;
    animation: pulse 2s linear infinite;
    will-change: transform, opacity;
    transform: translateZ(0);
  }

  .loading-text {
    color: #e2e8f0;
    font-size: 1.1rem;
    font-weight: 500;
    opacity: 0.85;
    text-align: center;
    transition: opacity 0.3s ease;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    letter-spacing: 0.3px;
    animation: textFade 2s linear infinite alternate;
    will-change: opacity;
  }

  .loading-progress {
    width: 240px;
    height: 4px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
  }

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, ${finalConfig.primaryColor}, #8b5cf6, #06b6d4, #10b981);
    background-size: 200% 100%;
    border-radius: 2px;
    width: 0%;
    transition: width 0.2s ease-out;
    position: relative;
    animation: gradientFlow 2s linear infinite;
    box-shadow: 0 0 6px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    will-change: width;
    transform: translateZ(0);
  }

  .progress-bar::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    animation: shimmer 2.5s infinite;
  }

  .progress-percentage {
    position: absolute;
    top: -22px;
    right: 0;
    color: rgba(226, 232, 240, 0.7);
    font-size: 0.8rem;
    font-weight: 400;
    font-variant-numeric: tabular-nums;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes float {
    0% {
      transform: translateY(0) rotate(0deg) translateZ(0);
    }
    50% {
      transform: translateY(-4px) rotate(180deg) translateZ(0);
    }
    100% {
      transform: translateY(0) rotate(360deg) translateZ(0);
    }
  }

  @keyframes pulse {
    0% {
      opacity: 0.2;
      transform: scale(0.95) translateZ(0);
    }
    50% {
      opacity: 0.4;
      transform: scale(1.05) translateZ(0);
    }
    100% {
      opacity: 0.2;
      transform: scale(0.95) translateZ(0);
    }
  }

  @keyframes breathe {
    0% {
      transform: scale(1) translateZ(0);
      opacity: 0.15;
    }
    50% {
      transform: scale(1.03) translateZ(0);
      opacity: 0.3;
    }
    100% {
      transform: scale(1) translateZ(0);
      opacity: 0.15;
    }
  }

  @keyframes textFade {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 0.85;
    }
    100% {
      opacity: 0.6;
    }
  }

  @keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }

  @keyframes pulseBackground {
    0% {
      opacity: 0.2;
      transform: scale(1) translateZ(0);
    }
    50% {
      opacity: 0.35;
      transform: scale(1.01) translateZ(0);
    }
    100% {
      opacity: 0.2;
      transform: scale(1) translateZ(0);
    }
  }

  @media (max-width: 640px) {
    .loading-container {
      gap: 1.5rem;
    }
    .loading-spinner {
      width: 60px;
      height: 60px;
    }
    .loading-text {
      font-size: 1rem;
    }
    .loading-progress {
      width: 160px;
    }
  }
</style>

<div id="app-loading" class="loading-overlay">
  <div class="loading-container">
    <div class="loading-spinner">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="loading-core"></div>
    </div>
    <div class="loading-text">${finalConfig.texts.loading}</div>
    <div class="loading-progress">
      <div class="progress-bar" id="loading-progress"></div>
      <div class="progress-percentage" id="progress-percentage">0%</div>
    </div>
  </div>
  <div class="door-left"></div>
  <div class="door-right"></div>
</div>

<script>
(function() {
  'use strict';

  const CONFIG = ${JSON.stringify(finalConfig)};

  class LoadingManager {
    constructor() {
      this.startTime = Date.now();
      this.progress = 0;
      this.isComplete = false;
      this.elements = {
        overlay: document.getElementById('app-loading'),
        text: document.querySelector('.loading-text'),
        progressBar: document.getElementById('loading-progress'),
        percentage: document.getElementById('progress-percentage')
      };

      this.init();
    }

    init() {
      this.setupProgressTracking();
      this.setupEventListeners();
      this.setupGlobalAPI();
    }

    setupProgressTracking() {
      // 模拟智能进度
      this.updateProgress(10);

      // DOM加载进度
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.updateProgress(40);
        });
      } else {
        this.updateProgress(40);
      }

      // 资源加载进度
      window.addEventListener('load', () => {
        this.updateProgress(70);
      });

      // 检测Vue应用挂载
      this.detectAppMount();
    }

    detectAppMount() {
      const checkMount = () => {
        if (document.querySelector('[data-v-]') ||
            document.querySelector('.vue-app') ||
            window.Vue || window.__VUE__) {
          this.updateProgress(90);
          setTimeout(() => this.complete(), 200);
          return;
        }

        if (Date.now() - this.startTime > 5000) {
          this.complete();
          return;
        }

        setTimeout(checkMount, 100);
      };

      setTimeout(checkMount, 500);
    }

    setupEventListeners() {
      // 监听应用就绪事件
      const events = ['vue-app-ready', 'app-mounted', 'app-ready'];
      events.forEach(event => {
        document.addEventListener(event, () => this.complete());
      });

      window.addEventListener('app-ready', () => this.complete());
    }

    setupGlobalAPI() {
      window.$loading = {
        complete: () => this.complete(),
        setProgress: (progress) => this.updateProgress(progress),
        setText: (text) => this.setText(text)
      };
    }

    updateProgress(progress) {
      this.progress = Math.min(100, Math.max(0, progress));
      if (this.elements.progressBar) {
        this.elements.progressBar.style.width = this.progress + '%';
      }
      if (this.elements.percentage) {
        this.elements.percentage.textContent = Math.round(this.progress) + '%';
      }
    }

    setText(text) {
      if (this.elements.text) {
        this.elements.text.textContent = text;
      }
    }

    complete() {
      if (this.isComplete) return;

      const elapsed = Date.now() - this.startTime;
      const minTime = CONFIG.minTime;

      const finish = () => {
         this.isComplete = true;
         this.updateProgress(100);
         this.setText(CONFIG.texts.complete);

         // 等待加载完成动画结束后再开始开门
         setTimeout(() => {
           if (this.elements.overlay) {
             // 开始推拉门动画
             this.elements.overlay.classList.add('door-opening');

             // 创建门的元素
             const doorLeft = this.elements.overlay.querySelector('.door-left');
             const doorRight = this.elements.overlay.querySelector('.door-right');

             // 确保门有背景色
             if (doorLeft) doorLeft.style.background = CONFIG.backgroundColor;
             if (doorRight) doorRight.style.background = CONFIG.backgroundColor;

             setTimeout(() => {
               this.elements.overlay?.remove();
             }, 800);
           }
         }, 400);
      };

      if (elapsed < minTime) {
        setTimeout(finish, minTime - elapsed);
      } else {
        finish();
      }
    }
  }

  // 启动加载管理器
  new LoadingManager();
})();
</script>
`

      return html.replace(/<body[^>]*>/, (match) => match + loadingHTML)
    },
  }
}
