<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/dashboard'
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <!-- Hero section -->
    <div class="text-center py-12">
      <h2 class="text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl">
        Track and Suggest Coolify Templates
      </h2>
      <p class="mt-5 max-w-xl mx-auto text-xl text-gray-800 dark:text-gray-100">
        Discover one-click deploy templates for Coolify and contribute to the community by suggesting new apps and services.
      </p>
      <div class="mt-8">
        <UButton
          to="/dashboard"
          color="indigo"
          size="lg"
        >
          Get Started
        </UButton>
      </div>
    </div>

    <!-- Features section -->
    <div class="py-12 bg-zinc-300 dark:bg-gray-700 ">
      <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 class="sr-only">
          Features
        </h2>
        <dl class="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          <div>
            <dt class="font-bold text-lg leading-6 text-gray-900 dark:text-gray-100">
              Track Templates
            </dt>
            <dd class="mt-2 text-base text-gray-500 ">
              Browse and discover a wide range of templates available for one-click deployment on Coolify.
            </dd>
          </div>
          <div>
            <dt class="font-bold text-lg leading-6 text-gray-900 dark:text-gray-100">
              Upvote Favorites
            </dt>
            <dd class="mt-2 text-base text-gray-500">
              Log in with your GitHub account and upvote the templates you find most useful.
            </dd>
          </div>
          <div>
            <dt class="font-bold text-lg leading-6 text-gray-900 dark:text-gray-100">
              Suggest New Apps
            </dt>
            <dd class="mt-2 text-base text-gray-500">
              Contribute to the community by suggesting new apps and services to be added as templates.
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- CTA section -->
    <div class="bg-slate-900 text-gray-50">
      <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold sm:text-4xl ">
          <span class="block">Ready to get started?</span>
        </h2>
        <p class="mt-4 text-lg leading-6">
          Explore templates, suggest new services, upvote and contribute to the community.
        </p>

        <ULink
          to="/api/auth/signin"
          external
          size="lg"
          class="focus:outline-none focus-visible:outline-0 mt-4 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-full text-sm gap-x-2.5 px-3.5 py-2.5 shadow-sm dark:shadow-black/10 border border-white/20 hover:border-white/30 focus:border-white/30  dark:text-white bg-white/10 hover:bg-white/5 backdrop-blur-sm transition-colors duration-100 inline-flex items-center"
        >
          <UIcon name="i-uil-github" class="w-5 h-5 mr-2" />
          Sign up with GitHub
        </ULink>
      </div>
    </div>
  </div>
</template>
