<template>
  <div class="container">
    upload
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Upload',
  props: {
    text: String,
    backUrl: String
  }
})
</script>

<style scoped>
</style>
