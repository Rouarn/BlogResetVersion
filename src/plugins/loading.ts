import { h, ref, render } from 'vue'

export interface LoadingProviderInst {
  open: () => void
  close: () => void
}

let loadingInstance: LoadingProviderInst
let container: HTMLDivElement | null = null
let needLoadingRequestCount = 0

const initLoading = () => {
  if (container) return

  container = document.createElement('div')
  document.body.appendChild(container)

  const isLoading = ref(false)

  const open = () => {
    isLoading.value = true
  }

  const close = () => {
    isLoading.value = false
  }

  // 直接创建渲染函数
  const renderFn = () =>
    h(
      'div',
      {
        class: 'loading-box',
        style: { display: isLoading.value ? 'flex' : 'none' },
      },
      [h('div', { class: 'loader' })],
    )

  const vnode = h({
    setup() {
      return { open, close }
    },
    render: renderFn,
  })

  render(vnode, container)

  loadingInstance = {
    open,
    close,
  }
}

/** Setup plugin Loading */
export function setupLoading() {
  initLoading()

  const loading: LoadingProviderInst = {
    open: () => {
      if (needLoadingRequestCount === 0) {
        loadingInstance?.open()
      }
      needLoadingRequestCount++
    },
    close: () => {
      if (needLoadingRequestCount <= 0) return

      needLoadingRequestCount--
      if (needLoadingRequestCount === 0) {
        loadingInstance?.close()
      }
    },
  }

  // mount on window
  window.$loading = loading
}
