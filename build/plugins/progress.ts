import type { PluginOption } from 'vite'
import progress from 'vite-plugin-progress'

export function setupProgressPlugin(): PluginOption {
  return progress()
}
