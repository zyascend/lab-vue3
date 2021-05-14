<template>
  <div class="container">
    <div class="clip" :style="{'background':'url('+ backUrl +') center no-repeat'}" >
      <h1>{{ text }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TextMask',
  props: {
    text: String,
    backUrl: String
  }
})
</script>

<style scoped>
.container {
  width: 760px;
  margin: 10px auto;
}
.clip {
  background-size: cover !important;
  color: #fff;
  -webkit-text-fill-color: transparent;
  background-clip: text !important;
}
.clip h1 {
  font-size: 200px;
  font-family: sans-serif;
  text-align: center;
  text-shadow: 0 0 1px rgba(0,0,0,.1);
  margin: 0;
  padding: 0;
  user-select: none;
}
</style>
