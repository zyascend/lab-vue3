<template>
  <div class="components">
    <h1>CSS动画效果</h1>
  <show-block title="文字震动">
    <shake-text text="SHAKING"></shake-text>
  </show-block>
  <show-block title="文字遮罩">
    <text-mask text="LION" :backUrl="imgUrl"></text-mask>
  </show-block>
  <show-block title="Loading">
    <letter-loading text="LOADING..."></letter-loading>
  </show-block>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ShakeText from '@/components/ShakeText.vue'
import ShowBlock from '@/components/ShowBlock.vue'
import TextMask from '@/components/TextMask.vue'
import LetterLoading from '@/components/LetterLoading.vue'

/**
 * 展示CSS动画效果
 */
export default defineComponent({
  name: 'CssAnimation',
  components: {
    ShakeText,
    ShowBlock,
    TextMask,
    LetterLoading
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
