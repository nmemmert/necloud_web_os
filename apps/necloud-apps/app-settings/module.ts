import { defineNuxtModule, createResolver, addComponentsDir, addPlugin } from '@nuxt/kit'
import { registerTailwindPath } from '@owdproject/core'

export default defineNuxtModule({
  meta: { name: 'necloud-app-settings', configKey: 'settings' },
  async setup(_, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    addComponentsDir({ path: resolve('./runtime/components') })
    addPlugin(resolve('./runtime/plugin'))
    registerTailwindPath(nuxt, resolve('./runtime/components/**/*.{vue,mjs,ts}'))
  }
})
