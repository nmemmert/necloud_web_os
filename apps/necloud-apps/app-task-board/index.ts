import { defineDesktopApp } from '@owdproject/core'

export default defineDesktopApp({
  id: 'task-board',
  title: 'Task Board',
  icon: 'i-mdi-view-column',
  category: 'Productivity',
  singleton: true,
  
  entries: {
    default: {
      title: 'Task Board',
      command: 'open-tasks'
    }
  },
  
  windows: {
    default: {
      title: 'Task Board',
      component: () => import('./components/TaskBoardWindow.vue'),
      size: {
        width: 1100,
        height: 700
      },
      position: {
        x: 80,
        y: 50
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
