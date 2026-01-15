import animate from '@/directives/animate'
import clickoutside from '@/directives/clickoutside'
import copy from '@/directives/copy'
import debounce from '@/directives/debounce'
import draggable from '@/directives/draggable'
import focus from '@/directives/focus'
import highlight from '@/directives/highlight'
import lazy from '@/directives/lazy'
import loading from '@/directives/loading'
import longpress from '@/directives/longpress'
import mask from '@/directives/mask'
import ripple from '@/directives/ripple'
import role from '@/directives/role'
import scroll from '@/directives/scroll'
import throttle from '@/directives/throttle'
import tooltip from '@/directives/tooltip'
import waterMarker from '@/directives/waterMarker'
import type { App, Directive } from 'vue'

const directivesList: { [key: string]: Directive } = {
  copy,
  debounce,
  draggable,
  longpress,
  throttle,
  waterMarker,
  focus,
  clickoutside,
  loading,
  mask,
  role,
  lazy,
  highlight,
  ripple,
  tooltip,
  animate,
  scroll,
}

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach((key) => {
      if (directivesList[key]) {
        app.directive(key, directivesList[key] as Directive)
      }
    })
  },
}

export function setupDirectives(app: App<Element>) {
  app.use(directives)
}
export default directives
