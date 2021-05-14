<template>
  <div class="components">
    <h1>CSS动画效果</h1>
  <show-block title="文字震动">
    <shake-text text="SHAKING" />
  </show-block>
  <show-block title="文字遮罩">
    <text-mask text="LION" :backUrl="imgUrl"/>
  </show-block>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ShakeText from '@/components/ShakeText.vue'
import ShowBlock from '@/components/ShowBlock.vue'
import TextMask from '@/components/TextMask.vue'

/**
 * 展示CSS动画效果
 */
export default defineComponent({
  name: 'CssAnimation',
  components: {
    ShakeText,
    ShowBlock,
    TextMask
  },

  setup () {
    return {
      imgUrl: require('../assets/lion.jpg')
    }
  }
})
</script>

<style scoped>
.text-back {
  background: #000;
  padding: 20px;
}
</style>
