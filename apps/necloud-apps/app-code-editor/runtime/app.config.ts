import type { ApplicationConfig } from '@owdproject/core'

export default {
  id: 'org.necloud.code-editor',
  title: 'Code Editor',
  icon: 'mdi:code-braces',
  category: 'system-tools',
  singleton: false,
  
  entries: {
    main: {
      title: 'Code Editor',
      description: 'Multi-file code editor',
      command: 'open-editor',
      visibility: 'primary'
    }
  },
  
  windows: {
    default: {
      component: () => import('./components/CodeEditorWindow.vue'),
      size: {
        width: 900,
        height: 600
      },
      position: {
        x: 120,
        y: 80
      },
      minimizable: true,
      maximizable: true,
      destroyable: true,
      draggable: true,
      resizable: true
    }
  },
  
  commands: {
    'open-editor': (app: any) => {
      app.openWindow('default')
    }
  }
}
