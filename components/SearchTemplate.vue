<script setup lang="ts">
const searchQuery = ref('')
const templates = ref()
const isOpen = ref(false)
const { status, data, refresh } = await useAsyncData('searchTemplates', async () => {
  const data = await $fetch('/api/templates/search', {
    query: {
      search: searchQuery.value
    },
  })
  return data
})

templates.value = data.value || []

watch(searchQuery, async () => {
  await $fetch('/api/templates/search', {
    query: {
      search: searchQuery.value
    },
  })
  refresh()
})

const isLoading = status.value === 'pending'

const route = useRoute()
const router = useRouter()

function updateSearch() {
  router.push({ query: { search: searchQuery.value || undefined } })
}

function calculateScore(likes: any[]) {
  const upvotes = likes.filter(like => like.score === 1)
  const downvotes = likes.filter(like => like.score === -1)
  return upvotes.length - downvotes.length
}
function _getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'active':
      return 'green'
    case 'suggested':
      return 'yellow'
    case 'inactive':
      return 'red'
    default:
      return 'gray'
  }
}

const session = useAuth()
const user = computed(() => session.data.value?.user)
// Watch for changes in the route query
watch(() => route.query.search, (newSearch) => {
  const searchValue = newSearch as string || ''
  if (searchValue !== searchQuery.value) {
    searchQuery.value = searchValue
  }
}, { immediate: true })
const statuFilter = ref([
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Suggested',
    value: 'suggested'
  },
  {
    label: 'Active',
    value: 'active'
  },
  {
    label: 'Inactive',
    value: 'inactive'
  }
])
const LikeSort = ref([

  {
    label: 'Most Upvoted',
    value: 'most-upvoted'
  },
  {
    label: 'Most Downvoted',
    value: 'most-downvoted'
  }
])
</script>

<template>
  <UContainer>
    <div class="flex justify-between items-center mb-4 gap-4">
      <UInput
        v-model="searchQuery" :loading="isLoading" icon="i-heroicons-magnifying-glass"
        placeholder="Search templates..." class=" w-full" @update:model-value="updateSearch"
      />
      <UButton icon="i-heroicons-plus-solid" variant="soft" size="sm" color="primary" @click="isOpen = true">
        New
      </UButton>
    </div>
    <div>
      <div class="flex justify-between  mb-4 gap-4">
        <USelect v-model="statuFilter" :options="statuFilter" label="Status" />
        <USelect v-model="LikeSort" :options="LikeSort" label="Sort" />
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <UIcon name="i-heroicons-magnifying-glass" class="animate-spin" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="template in data" :key="template.id" class="h-full">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">
              {{ template.name }}
            </h3>
            <div class="flex items-center gap-2">
              <UBadge color="primary" class="capitalize text-xs font-bold">
                {{ template.status }}
              </UBadge>
              <CardMenu template-id="template.id" />
            </div>
          </div>
        </template>
        <p class="text-sm text-gray-600 mb-4 truncate">
          {{ template.description }}
        </p>

        <template #footer>
          <div class="flex justify-between items-center">
            <UButton
              :to="template.appUrl" color="gray" variant="link" size="sm" target="_blank"
              rel="noopener noreferrer" icon="i-heroicons-globe-alt"
            >
              Website
            </UButton>
            <UButton
              target="_blank" rel="noopener noreferrer" :to="template.discussionUrl" variant="link" color="gray"
              size="sm" icon="i-heroicons-chat-bubble-left-ellipsis"
            >
              Discuss
            </UButton>
            <Upvotes
              :template-id="template.id" :score="calculateScore(template.likes)"
              :is-upvoted="template.likes.some(like => like.userId === user?.id && like.score === 1)"
              :is-downvoted="template.likes.some(like => like.userId === user?.id && like.score === -1)"
            />
          </div>
        </template>
      </UCard>
    </div>
    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <p class="text-lg font-semibold">
            New Suggestion
          </p>
        </template>

        <CreateTemplate />
      </UCard>
    </UModal>
    <p v-if="data?.length === 0 && !isLoading && searchQuery" class="text-center text-gray-500 mt-8">
      No templates found matching your search.
    </p>
  </UContainer>
</template>
