<template>
  <div class="home">
    <h1>暂时实现的效果</h1>
    <div class="home-links">
      <router-link to="/components">经典组件</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import Header from '@/components/Header.vue' // @ is an alias to /src

export default defineComponent({
  name: 'Home',
  components: {
  }
})
</script>

<style scoped>
.home-links {
  padding: 30px;
  display: flex;
  flex-flow: column;
}
.home-links a {
  margin: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
}
.home-links a.router-link-exact-active {
  color: #42b983;
}
</style>
