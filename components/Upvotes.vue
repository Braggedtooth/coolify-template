<script setup lang="ts">
import type { Like, Service } from '@prisma/client'

type TemplateWithScore = Service & {
  likes: Like[]
}
const props = defineProps<{
  score: number
  templateId: string
  isUpvoted: boolean
  isDownvoted: boolean
}>()

const toast = useToast()

async function upvote() {
  try {
    await $fetch<TemplateWithScore>('/api/templates/upvote', {
      method: 'PATCH',
      query: {
        id: props.templateId
      }
    })
    refreshNuxtData(['searchTemplates'])
    toast.add({
      id: 'upvote',
      title: 'Upvoted!',
      icon: 'i-octicon-star',
      timeout: 2000,
    })
  }
  catch (e: any) {
    toast.add({ id: 'upvote', title: 'Something went wrong', description: e.data.statusMessage, icon: 'i-octicon-star', timeout: 2000 })
  }
}

async function downvote() {
  try {
    await $fetch<TemplateWithScore>('/api/templates/downvote', {
      method: 'PATCH',
      query: {
        id: props.templateId
      }
    })

    refreshNuxtData(['searchTemplates'])

    toast.add({
      id: `downvote-sucess`,
      title: 'Downvoted',
      icon: 'i-octicon-dash',
      timeout: 2000,

    })
  }
  catch (e: any) {
    toast.add({ id: 'downvote', title: 'Something went wrong', description: e.data.statusMessage, icon: 'i-octicon-dash', timeout: 2000 })
  }
}
</script>

<template>
  <div class="flex flex-row items-center gap-2">
    <UButton
      icon="i-heroicons-chevron-up"
      variant="ghost"
      size="2xs"
      :disabled="isUpvoted"
      :class="{ 'text-orange-500': isUpvoted }"
      aria-label="Upvote"
      @click="upvote"
    />
    <span
      class="text-sm font-bold"
      :class="{
        'text-orange-500': score > 0,
        'text-blue-500': score < 0,
      }"
    >
      {{ score }}
    </span>
    <UButton
      icon="i-heroicons-chevron-down"
      variant="ghost"
      size="2xs"
      :disabled="isDownvoted"
      :class="{ 'text-blue-500': isDownvoted }"
      aria-label="Downvote"
      @click="downvote"
    />
  </div>
</template>
