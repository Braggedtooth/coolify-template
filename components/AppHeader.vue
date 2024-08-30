<script setup lang="ts">
const {
  status,
  signIn,
  signOut,
  getSession,

} = useAuth()
const session = await getSession()
const toast = useToast()

async function handleSignin() {
  await signIn('github').then(async () => {
    toast.add({
      id: 'update_downloaded',
      title: 'Update downloaded.',
      description: 'It will be installed on restart. Restart now?',
      icon: 'i-octicon-desktop-download-24',
      timeout: 0,
      actions: [{
        label: 'Restart',
        click: () => {
          window.location.reload()
        }
      }]
    })
  })
}
</script>

<template>
  <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-6 flex items-center justify-between sticky top-0 left-0 right-0 z-50">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        Coolify  <UBadge
          label="Templates"
          variant="subtle"
          class="mb-0.5"
        />
      </div>
    </div>
    <div class="ml-4 flex items-center md:ml-6">
      <UButton
        v-if="status !== 'authenticated'"
        :loading="status === 'loading'"
        label="Sign in"
        color="white"
        icon="i-uil-github"
        trailing-icon="i-solar-login-3-bold-duotone"
        @click="handleSignin"
      />

      <div v-if="status === 'authenticated'">
        <div class="flex items-center gap-2">
          <UButton
            label="Sign out"
            avatar
            color="white"
            trailing-icon="i-solar-logout-3-bold-duotone"
            @click="signOut"
          >
            <template #leading>
              <UAvatar
                :src="session?.user?.image"
                size="2xs"
                alt="Avatar"
              />
            </template>
          </UButton>
        </div>
      </div>
    </div>
  </header>
</template>
