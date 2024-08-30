// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@sidebase/nuxt-auth',
    '@nuxtjs/i18n',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@prisma/nuxt',
    'nuxt-lodash',
    '@nuxtjs/mdc'
  ],

  prisma: {
    installStudio: true,
    autoSetupPrisma: true,
    generateClient: true,

  },

  i18n: {
    strategy: 'prefix_except_default',
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    locales: [
      {
        name: 'English',
        code: 'en',
        file: 'en.json'
      }
    ],
    experimental: {
      localeDetector: './localeDetector.ts'
    }
  },
  typescript: {
    shim: false
  },

  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,

  },

  compatibilityDate: '2024-08-14',

  devtools: {
    timeline: {
      enabled: true
    }
  }
})
