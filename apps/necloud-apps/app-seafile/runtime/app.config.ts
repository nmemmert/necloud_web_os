import type { ApplicationConfig } from '@owdproject/core'

export default {
  id: 'org.necloud.seafile',
  title: 'Seafile',
  icon: 'mdi:folder-network',
  category: 'productivity',
  singleton: false,
  
  entries: {
    main: {
      title: 'Seafile',
      description: 'Cloud file manager',
      command: 'open-seafile',
      visibility: 'primary'
    }
  },
  
  windows: {
    default: {
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
  
  commands: {
    'open-seafile': (app: any) => {
      app.openWindow('default')
    }
  }
}
