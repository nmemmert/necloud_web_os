import type { ApplicationConfig } from '@owdproject/core'

export default {
  id: 'org.necloud.vaultwarden',
  title: 'Password Manager',
  icon: 'mdi:shield-key',
  category: 'system-tools',
  singleton: true,
  
  entries: {
    main: {
      title: 'Password Manager',
      description: 'Manage your passwords',
      command: 'open-vault',
      visibility: 'primary'
    }
  },
  
  windows: {
    default: {
      component: () => import('./components/VaultwardenWindow.vue'),
      size: {
        width: 900,
        height: 650
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
    'open-vault': (app: any) => {
      app.openWindow('default')
    }
  }
}
