<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { infer as InferType } from 'zod'
import { ZodError, z } from 'zod'
import { signIn } from 'next-auth/react'
import type { FormSubmitEvent } from '#ui/types'

const props = defineProps<{
  showModal: boolean
}>()

const emit = defineEmits(['update:showModal'])

const internalShowModal = computed({
  get: () => props.showModal,
  set: value => emit('update:showModal', value),
})

const schema = z.object({
  name: z.string().refine(async (val) => {
    const exist = await $fetch('/api/templates/search', {
      query: {
        search: val,
        precise: true
      }
    })
    return exist.length === 0
  }, { message: 'Template has already been suggested' }),
  description: z.string(),
  appUrl: z.string().url(),
  discussionUrl: z.string().url(),
})
type Schema = InferType<typeof schema>

const state = reactive({
  name: undefined,
  description: undefined,
  appUrl: undefined,
  discussionUrl: undefined
})

const form = ref()
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  form.value.clear()
  try {
    await $fetch('/api/templates/create', {
      method: 'POST',
      body: JSON.stringify(event.data),

    })
    refreshNuxtData('searchTemplates')
    toast.add({
      id: 'template-created',
      title: 'Template Created',
      description: 'Your template has been created successfully.',
      timeout: 5000,
    })
  }
  catch (err: any) {
    if (err instanceof ZodError) {
      form.value.setErrors(err.errors.map((err: any) => ({
        // Map validation errors to { path: string, message: string }
        message: err.statusMessage,
        path: err.path,
      })))
      return
    }
    toast.add({
      id: 'template-creation-failed',
      title: 'Template Creation Failed',
      description: err.statusMessage,
      timeout: 0,
      color: 'red',
      actions: [{
        label: 'Login',
        color: 'blue',
        icon: 'i-uil-github',
        click: () => {
          signIn()
        }
      }],
    })
  }
}
</script>

<template>
  <UModal v-model="internalShowModal">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <p class="text-lg font-semibold">
          New Suggestion
        </p>
      </template>

      <UForm ref="form" :schema="schema" :state="state" class="flex flex-col gap-4" :validate-on="['change', 'submit', 'input']" @submit="onSubmit">
        <UFormGroup label="Application Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup label="Website/ Documentation" name="appUrl">
          <UInput v-model="state.appUrl" type="url" />
        </UFormGroup>
        <UFormGroup label="Discussion Forum" name="discussionUrl">
          <UInput v-model="state.discussionUrl" type="url" />
          <template #description>
            <p class="text-xs">
              A direct link to discusstion regarding adding the template i.e discord or github.
            </p>
          </template>
        </UFormGroup>

        <UFormGroup label="Description" name="description">
          <UTextarea v-model="state.description" />
          <template #description>
            <p class="text-xs">
              A short desctiption of the app.
            </p>
          </template>
        </UFormGroup>
        <div class="flex justify-end gap-4">
          <UButton type="submit">
            Submit
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>
