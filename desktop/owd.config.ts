import { defineDesktopConfig } from '@owdproject/core/runtime/utils/utilDesktop'

export default defineDesktopConfig({
  apps: [
    '@owdproject/app-about',
    '@owdproject/app-todo',
    '@owdproject/app-terminal',
    '@owdproject/app-debug',
    '@owdproject/app-youtube',
    '@owdproject/app-classic-videoplayer',
    '@owdproject/app-soundcloud',
    '@owdproject/app-atproto',
    '@owdproject/app-classic-audioplayer',
    '@owdproject/app-wasmboy',
    '@necloud/app-seafile',
    '@necloud/app-vaultwarden',
    '@necloud/app-media-center',
    '@necloud/app-task-board',
    '@necloud/app-notes',
    '@necloud/app-terminal',
    '@necloud/app-code-editor',
      '@necloud/app-explorer', // existing explorer
      '@necloud/app-settings'
  ],
  modules: [],
  theme: '@owdproject/theme-gnome',
})
