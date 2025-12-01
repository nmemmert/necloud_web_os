import { defineDesktopApp } from '@owdproject/core'

export default defineDesktopApp({
  id: 'media-center',
  title: 'Media Center',
  icon: 'i-mdi-play-circle',
  category: 'Media',
  singleton: false,
  
  entries: {
    default: {
      title: 'Media Center',
      command: 'open-media'
    }
  },
  
  windows: {
    default: {
      title: 'Media Center',
      component: () => import('./components/MediaCenterWindow.vue'),
      size: {
        width: 1000,
        height: 700
      },
      position: {
        x: 100,
        y: 60
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
