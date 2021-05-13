<template>
  <div class="components">
    <h1>经典组件实现</h1>
    <pre>{{route}}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
/**
 * 展示经典Vue实现的经典组件
 */
export default defineComponent({
  name: 'Components',
  components: {
  },

  setup () {
    const route = useRoute()
    return {
      route
    }
  }
})
</script>

<style scoped>

</style>
