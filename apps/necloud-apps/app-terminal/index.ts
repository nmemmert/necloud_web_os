import { defineDesktopApp } from '@owdproject/core'

export default defineDesktopApp({
  id: 'terminal',
  title: 'Terminal',
  icon: 'i-mdi-console',
  category: 'Development',
  singleton: false,
  
  entries: {
    default: {
      title: 'Terminal',
      command: 'open-terminal'
    }
  },
  
  windows: {
    default: {
      title: 'Terminal',
      component: () => import('./components/TerminalWindow.vue'),
      size: {
        width: 800,
        height: 500
      },
      position: {
        x: 150,
        y: 100
      },
      minimizable: true,
      maximizable: true,
      destroyable: true,
      draggable: true,
      resizable: true
    }
  },
  
  async onLaunch(app) {
    app.openWindow('default')
  }
})
