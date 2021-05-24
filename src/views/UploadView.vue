<template>
  <div class='container'>
    <upload></upload>
  </div>
</template>
<script lang='ts'>
import { defineComponent, toRefs, reactive } from 'vue'
import Upload from '@/components/UpLoad.vue'

export default defineComponent({
  name: 'UploadView',
  components: {
    Upload
  },
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
