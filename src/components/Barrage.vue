<template>
  <div class="barrage-container">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Barrage',
  props: {
    title: String
  }
})
</script>

<style lang="scss" scoped>
.barrage-container {
}
</style>
