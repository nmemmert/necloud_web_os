import { defineNuxtPlugin } from 'nuxt/app'
import { defineDesktopApp } from '@owdproject/core/runtime/utils/utilDesktop'
import configAppSeafile from './app.config'

export default defineNuxtPlugin({
  parallel: true,
  async setup(nuxtApp) {
    nuxtApp.hook('app:created', async () => {
      await defineDesktopApp(configAppSeafile)
    })
  },
})
