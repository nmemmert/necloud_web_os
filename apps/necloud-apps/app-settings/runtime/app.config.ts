import type { ApplicationConfig } from '@owdproject/core'

const config: ApplicationConfig = {
  id: 'org.necloud.settings',
  title: 'Settings',
  icon: 'mdi:cog',
  category: 'system-tools',
  singleton: true,
  entries: {
    main: {
      title: 'Settings',
      description: 'System preferences and appearance',
      command: 'open-settings',
      visibility: 'primary'
    }
  },
  windows: {
    main: {
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
  commands: {
    'open-settings': (app: any) => app.openWindow('main')
  }
}

export default config
