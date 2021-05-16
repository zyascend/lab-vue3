<template>
  <div class="container">
    <show-block class="barrage-show-block">
      <barrage />
    </show-block>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Barrage from '@/components/Barrage.vue'
import ShowBlock from '@/components/ShowBlock.vue'

/**
 * 展示弹幕效果
 */
export default defineComponent({
  name: 'BarrageView',
  components: {
    Barrage,
    ShowBlock
  },

  setup () {
    return {
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../assets/mixin';
.container {
  @include fullFixed;
  width: 100%;
  height: 100%;
  background: rgb(238,174,202);
  background: radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(56,90,129,1) 83%);
  z-index: -1;
  .barrage-show-block {
    margin: 50px 60px;
  }
}
</style>
