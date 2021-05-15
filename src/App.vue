<template>
  <Header title="WebLab💢🧪🔬"/>
  <router-view/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Header from '@/components/Header.vue' // @ is an alias to /src
import '../src/assets/reset.css'
export default defineComponent({
  name: 'App',
  components: {
    Header
  }
})
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
