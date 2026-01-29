/* ===================== Loading 管理 ===================== */

/**
 * Loading 管理器
 * @description 防止重复触发 Loading，只有当计数器为 0 时才显示/隐藏
 */
export class LoadingManager {
  private count = 0

  /** 开启 Loading */
  open() {
    if (this.count === 0) window.$loading?.open()
    this.count++
  }

  /** 关闭 Loading */
  close() {
    this.count = Math.max(0, this.count - 1)
    if (this.count === 0) window.$loading?.close()
  }
}

export const loadingManager = new LoadingManager()
