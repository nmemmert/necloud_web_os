import type { ApplicationConfig } from '@owdproject/core'

export default {
  id: 'org.necloud.notes',
  title: 'Notes',
  icon: 'mdi:note-text',
  category: 'productivity',
  singleton: false,
  
  entries: {
    main: {
      title: 'Notes',
      description: 'Markdown note-taking',
      command: 'open-notes',
      visibility: 'primary'
    }
  },
  
  windows: {
    default: {
      component: () => import('./components/NotesWindow.vue'),
      size: {
        width: 800,
        height: 600
      },
      position: {
        x: 140,
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
    'open-notes': (app: any) => {
      app.openWindow('default')
    }
  }
}
