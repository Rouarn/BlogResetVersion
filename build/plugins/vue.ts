import vue from '@vitejs/plugin-vue'
import type { PluginOption } from 'vite'

export function setupVuePlugin(): PluginOption {
  return vue()
}
