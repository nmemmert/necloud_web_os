import { defineDesktopApp } from '@owdproject/core'

export default defineDesktopApp({
  id: 'vaultwarden',
  title: 'Password Manager',
  icon: 'i-mdi-shield-key',
  category: 'Security',
  singleton: true,
  
  entries: {
    default: {
      title: 'Vaultwarden',
      command: 'open-vault'
    }
  },
  
  windows: {
    default: {
      title: 'Password Manager',
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
  
  async onLaunch(app) {
    app.openWindow('default')
  }
})
