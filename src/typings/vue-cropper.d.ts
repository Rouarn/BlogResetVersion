declare module 'vue-cropper' {
  import type { App, DefineComponent } from 'vue'

  export interface vueCropperGlobal {
    version: string
    install: (app: App) => void
    VueCropper: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  }

  export const VueCropper: vueCropperGlobal['VueCropper']

  const globalCropper: vueCropperGlobal
  export default globalCropper
}
