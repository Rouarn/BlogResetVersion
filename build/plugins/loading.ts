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
    primaryColor: '#60a5fa',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
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
  }

  .loading-overlay::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(96, 165, 250, 0.06) 0%, transparent 70%);
    animation: pulseBackground 3s ease-in-out infinite;
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
     background: ${finalConfig.backgroundColor};
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
  }

  .loading-container::before {
    content: '';
    position: absolute;
    inset: -50px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    animation: breathe 4s ease-in-out infinite;
  }

  .loading-spinner {
    position: relative;
    width: 120px;
    height: 120px;
    animation: float 3s ease-in-out infinite;
  }

  .spinner-ring {
    position: absolute;
    inset: 0;
    border: 4px solid transparent;
    border-radius: 50%;
    animation: spin 2s linear infinite;
    filter: drop-shadow(0 0 10px currentColor);
  }

  .spinner-ring:nth-child(1) {
    border-top-color: ${finalConfig.primaryColor};
    border-right-color: ${finalConfig.primaryColor};
    animation-duration: 2s;
    opacity: 1;
  }

  .spinner-ring:nth-child(2) {
    border-bottom-color: #8b5cf6;
    border-left-color: #8b5cf6;
    animation-duration: 2.5s;
    animation-direction: reverse;
    inset: 12px;
    opacity: 0.8;
  }

  .spinner-ring:nth-child(3) {
    border-top-color: #06b6d4;
    border-bottom-color: #06b6d4;
    animation-duration: 3s;
    inset: 24px;
    opacity: 0.6;
  }

  .spinner-ring:nth-child(4) {
    border-right-color: #f59e0b;
    border-left-color: #f59e0b;
    animation-duration: 3.5s;
    animation-direction: reverse;
    inset: 36px;
    opacity: 0.4;
  }

  .loading-core {
    position: absolute;
    inset: 45px;
    background: radial-gradient(circle, ${finalConfig.primaryColor}40, transparent 70%);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  .loading-text {
    color: white;
    font-size: 1.3rem;
    font-weight: 600;
    opacity: 0.95;
    text-align: center;
    transition: all 0.4s ease;
    text-shadow: 0 2px 8px rgba(96, 165, 250, 0.2);
    letter-spacing: 0.5px;
    animation: textGlow 2s ease-in-out infinite alternate;
  }

  .loading-progress {
    width: 280px;
    height: 6px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 3px;
    overflow: hidden;
    position: relative;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
  }

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, ${finalConfig.primaryColor}, #8b5cf6, #06b6d4, #f59e0b);
    background-size: 300% 100%;
    border-radius: 3px;
    width: 0%;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    animation: gradientFlow 3s ease-in-out infinite;
    filter: drop-shadow(0 2px 6px rgba(96, 165, 250, 0.25));
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
    top: -25px;
    right: 0;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    font-weight: 500;
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
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-10px) rotate(180deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.4;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  @keyframes breathe {
    0%, 100% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.6;
    }
  }

  @keyframes textGlow {
    from {
      text-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
    }
    to {
      text-shadow: 0 2px 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.3);
    }
  }

  @keyframes gradientFlow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes pulseBackground {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.05);
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
