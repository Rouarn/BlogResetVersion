import copy from '@/directives/copy'
import debounce from '@/directives/debounce'
import draggable from '@/directives/draggable'
import longpress from '@/directives/longpress'
import throttle from '@/directives/throttle'
import waterMarker from '@/directives/waterMarker'
import type { App, Directive } from 'vue'

const directivesList: { [key: string]: Directive } = {
  copy,
  waterMarker,
  draggable,
  debounce,
  throttle,
  longpress,
}

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach((key) => {
      app.directive(key, directivesList[key])
    })
  },
}

export function setupDirectives(app: App<Element>) {
  app.use(directives)
}
export default directives
