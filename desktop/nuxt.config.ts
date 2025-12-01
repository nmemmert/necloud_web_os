export default defineNuxtConfig({
  workspaceDir: '../../',

  ssr: false,

  devServer: {
    host: '127.0.0.1',
  },

  modules: ['@owdproject/core'],

  i18n: {
    strategy: 'no_prefix',
  },

  compatibilityDate: '2025-05-15',

  future: {
    compatibilityVersion: 4,
  },

  devtools: {
    enabled: false,
  },

  // global desktop styles override for readability
  // use relative path because workspaceDir alters @ alias scope
  css: ['./assets/css/global.css'],

  // Ensure a single Vue/reactivity instance across theme and apps
  vite: {
    resolve: {
      dedupe: [
        'vue',
        '@vue/shared',
        '@vue/reactivity',
        '@vue/runtime-core',
        '@vue/runtime-dom',
      ],
    },
  },
})
