import { defineDesktopApp } from '@owdproject/core'

export default defineDesktopApp({
  id: 'notes',
  title: 'Notes',
  icon: 'i-mdi-note-text',
  category: 'Productivity',
  singleton: false,
  
  entries: {
    default: {
      title: 'Notes',
      command: 'open-notes'
    }
  },
  
  windows: {
    default: {
      title: 'Notes',
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
  
  async onLaunch(app) {
    app.openWindow('default')
  }
})
