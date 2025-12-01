import type { ApplicationConfig } from '@owdproject/core'

export default {
  id: 'org.necloud.terminal',
  title: 'Terminal',
  icon: 'mdi:console',
  category: 'system-tools',
  singleton: false,
  
  entries: {
    main: {
      title: 'Terminal',
      description: 'Command-line interface',
      command: 'open-terminal',
      visibility: 'primary'
    }
  },
  
  windows: {
    default: {
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
  
  commands: {
    'open-terminal': (app: any) => {
      app.openWindow('default')
    }
  }
}
