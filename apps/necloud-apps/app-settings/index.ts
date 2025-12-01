import { defineDesktopApp } from '@owdproject/core'

export default defineDesktopApp({
  id: 'settings',
  title: 'Settings',
  icon: 'i-mdi-cog',
  category: 'System Tools',
  singleton: true,
  entries: {
    default: { title: 'Settings', command: 'open-settings' }
  },
  windows: {
    main: {
      title: 'Settings',
      component: () => import('./components/SettingsWindow.vue'),
      size: { width: 760, height: 560 },
      position: { x: 160, y: 110 },
      minimizable: true,
      maximizable: true,
      destroyable: true,
      draggable: true,
      resizable: true
    }
  },
  async onLaunch(app) { app.openWindow('main') }
})
