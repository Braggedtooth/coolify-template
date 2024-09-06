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
      <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
        Track and Suggest Coolify Templates
      </h2>
      <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">
        Discover one-click deploy templates for Coolify and contribute to the community by suggesting new apps and services.
      </p>
      <div class="mt-8">
        <a href="/dashboard" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          Get Started
        </a>
      </div>
    </div>

    <!-- Features section -->
    <div class="py-12 bg-white">
      <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 class="sr-only">
          Features
        </h2>
        <dl class="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          <div>
            <dt class="font-bold text-lg leading-6 text-gray-900">
              Track Templates
            </dt>
            <dd class="mt-2 text-base text-gray-500">
              Browse and discover a wide range of templates available for one-click deployment on Coolify.
            </dd>
          </div>
          <div>
            <dt class="font-bold text-lg leading-6 text-gray-900">
              Upvote Favorites
            </dt>
            <dd class="mt-2 text-base text-gray-500">
              Log in with your GitHub account and upvote the templates you find most useful.
            </dd>
          </div>
          <div>
            <dt class="font-bold text-lg leading-6 text-gray-900">
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
    <div class="bg-indigo-700">
      <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          <span class="block">Ready to get started?</span>
          <span class="block">Join our community today.</span>
        </h2>
        <p class="mt-4 text-lg leading-6 text-indigo-200">
          Explore templates, contribute ideas, and help shape the future of Coolify deployments.
        </p>
        <a href="/api/auth/signin" class="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto">
          Sign up with GitHub
        </a>
      </div>
    </div>
  </div>
</template>
