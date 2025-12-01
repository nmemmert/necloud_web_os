import { defineDesktopApp } from '@owdproject/core'

export default defineDesktopApp({
  id: 'seafile',
  title: 'Seafile',
  icon: 'i-mdi-folder-network',
  category: 'Files',
  singleton: false,
  
  entries: {
    default: {
      title: 'Seafile Files',
      command: 'open-seafile'
    }
  },
  
  windows: {
    default: {
      title: 'Seafile File Manager',
      component: () => import('./components/SeafileWindow.vue'),
      size: {
        width: 900,
        height: 600
      },
      position: {
        x: 100,
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
