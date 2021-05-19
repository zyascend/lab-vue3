<template>
  <div class='container'>
  </div>
</template>
<script lang='ts'>
import { defineComponent, toRefs, reactive } from 'vue'
export default defineComponent({
  name: 'Upload',
  components: {},
  props: {},
  setup (props) {
    const data = reactive({
    })
    const refData = toRefs(data)
    return {
      ...refData
    }
  }
})
</script>
<style lang='scss' scoped>
.container{
}
</style>
