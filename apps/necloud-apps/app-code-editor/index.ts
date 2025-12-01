import { defineDesktopApp } from '@owdproject/core'

export default defineDesktopApp({
  id: 'code-editor',
  title: 'Code Editor',
  icon: 'i-mdi-code-braces',
  category: 'Development',
  singleton: false,
  
  entries: {
    default: {
      title: 'Code Editor',
      command: 'open-editor'
    }
  },
  
  windows: {
    default: {
      title: 'Code Editor',
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
  
  async onLaunch(app) {
    app.openWindow('default')
  }
})
