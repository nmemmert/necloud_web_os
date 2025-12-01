import { defineDesktopApp } from '@owdproject/core'

export default defineDesktopApp({
  id: 'explorer',
  title: 'Explorer',
  icon: 'i-mdi-folder',
  category: 'System Tools',
  singleton: false,
  entries: {
    default: {
      title: 'Explorer',
      command: 'open-explorer'
    }
  },
  windows: {
    default: {
      title: 'Explorer',
      component: () => import('./components/ExplorerWindow.vue'),
      size: { width: 900, height: 600 },
      position: { x: 120, y: 80 },
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
