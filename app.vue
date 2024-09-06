<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})
const config = useRuntimeConfig()

useSeoMeta({
  title: 'Coolify Templates',
  ogImage: `${config.authOrigin}/og-image.jpeg`,
  twitterImage: `${config.authOrigin}/og-image.jpeg`,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <AppHeader />
    <main class="flex flex-col p-4 sm:p-6 lg:p-8 xl:p-10 flex-1 bg-gray dark:bg-gray-800 ">
      <NuxtPage />
      <UNotifications />
    </main>
    <AppFooter />
  </div>
</template>
