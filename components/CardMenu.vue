<script setup lang="ts">
import type { Status } from '@prisma/client'
import type { DropdownItem } from '#ui/types'

const props = defineProps<{
  templateId: string
  requestedById: string | null
  status: Status

}>()

const session = useAuth()
const isAdminOrRequestedBy = computed(() => session.data.value?.user?.id === props.requestedById || session.data.value?.user.role === 'ADMIN')
const toast = useToast()
const items: (DropdownItem | null)[][] = [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    disabled: !isAdminOrRequestedBy.value,
    click: () => {
      toast.add({
        id: 'edit-suggestion',
        title: 'Not Implemented',
        description: 'This feature is not implemented yet.',
        icon: 'i-octicon-x',
        color: 'red',
        timeout: 2000,
      })
    }
  }],
  [isAdminOrRequestedBy.value
    ? {
        label: 'Delete',
        icon: 'i-heroicons-trash-20-solid',
        external: true,
        disabled: !isAdminOrRequestedBy.value,
        click: () => {
          toast.add({
            id: 'delete-suggestion',
            title: 'Not Implemented',
            description: 'This feature is not implemented yet.',
            icon: 'i-octicon-x',
            color: 'red',
            timeout: 2000,
          })
        }
      }
    : null],

]

const filteredItems = computed(() => items.map(group =>
  group
    .filter((item): item is DropdownItem => item !== null)
))
</script>

<template>
  <UDropdown v-if="isAdminOrRequestedBy" :items="filteredItems" :popper="{ placement: 'bottom-start' }" class="w-full">
    <template #status="{ item }">
      <UBadge :color="item.color" class="capitalize text-xs font-bold">
        {{ item.label }}
      </UBadge>
    </template>
    <UButton color="white" trailing-icon="i-heroicons-ellipsis-vertical-solid" size="xs" />
  </UDropdown>
</template>
