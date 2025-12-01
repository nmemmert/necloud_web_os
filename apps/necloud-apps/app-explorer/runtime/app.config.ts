import type { ApplicationConfig } from '@owdproject/core'

const config: ApplicationConfig = {
  id: 'org.necloud.explorer',
  title: 'Explorer',
  icon: 'mdi:folder',
  category: 'system-tools',
  singleton: false,
  entries: {
    main: {
      title: 'Explorer',
      description: 'Browse files and folders',
      command: 'open-explorer',
      visibility: 'primary'
    }
  },
  windows: {
    default: {
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
  commands: {
    'open-explorer': (app: any) => {
      app.openWindow('default')
    }
  }
}

export default config
