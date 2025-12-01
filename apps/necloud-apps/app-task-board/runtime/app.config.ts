import type { ApplicationConfig } from '@owdproject/core'

export default {
  id: 'org.necloud.task-board',
  title: 'Task Board',
  icon: 'mdi:view-column',
  category: 'productivity',
  singleton: true,
  
  entries: {
    main: {
      title: 'Task Board',
      description: 'Kanban task management',
      command: 'open-tasks',
      visibility: 'primary'
    }
  },
  
  windows: {
    default: {
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
  
  commands: {
    'open-tasks': (app: any) => {
      app.openWindow('default')
    }
  }
}
