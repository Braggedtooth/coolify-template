<script setup lang="ts">
const { getSession } = useAuth()
const session = await getSession()
</script>

<template>
  <div>
    <!-- <h1>Coolify Template Suggestions</h1>
    <p>This is a coolify template suggestion page</p>

    <p>You are logged in as {{ session?.user?.email }}</p>
  </div> -->
    <SearchTemplate />
  </div>
</template>
