import type { ApplicationConfig } from '@owdproject/core'

export default {
  id: 'org.necloud.media-center',
  title: 'Media Center',
  icon: 'mdi:play-circle',
  category: 'productivity',
  singleton: false,
  
  entries: {
    main: {
      title: 'Media Center',
      description: 'Watch and track your media',
      command: 'open-media',
      visibility: 'primary'
    }
  },
  
  windows: {
    default: {
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
  
  commands: {
    'open-media': (app: any) => {
      app.openWindow('default')
    }
  }
}
