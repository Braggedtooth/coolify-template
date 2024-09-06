// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@sidebase/nuxt-auth',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    'nuxt-lodash',
  ],

  // vite: {
  //   resolve: {
  //     alias: {
  //       '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
  //     },
  //   },
  // },

  typescript: {
    shim: false
  },
  auth: {
    globalAppMiddleware: true
  },
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    authOrigin: process.env.AUTH_ORIGIN,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    repoUrl: process.env.REPO_URL,

  },

  compatibilityDate: '2024-08-14',

  devtools: {
    timeline: {
      enabled: true
    }
  }
})
