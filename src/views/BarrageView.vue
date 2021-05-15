<template>
  <div class="components">
    弹幕效果【TODO】
    <barrage />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Barrage from '@/components/Barrage.vue'

/**
 * 展示弹幕效果
 */
export default defineComponent({
  name: 'BarrageView',
  components: {
    Barrage
  },

  setup () {
    return {
    }
  }
})
</script>

<style scoped>
</style>
