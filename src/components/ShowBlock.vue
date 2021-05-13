<template>
  <div class="show-block">
    <h3>▶ {{ title }}</h3>
    <div class="block">
      <div class="head">
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="14" viewBox="0 0 54 14">
          <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
            <circle cx="6" cy="6" r="6" fill="#FF5F56" stroke="#E0443E" stroke-width=".5"></circle>
            <circle cx="26" cy="6" r="6" fill="#FFBD2E" stroke="#DEA123" stroke-width=".5"></circle>
            <circle cx="46" cy="6" r="6" fill="#27C93F" stroke="#1AAB29" stroke-width=".5"></circle>
          </g>
        </svg>
      </div>
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ShowBlock',
  props: {
    title: String
  }
})
</script>

<style scoped>
.show-block {
  display: flex;
  flex-direction: column;
}
.show-block h3{
  display: flex;
  flex-direction: row;
  margin-left: 10px;
}
.block {
  z-index: 1;
  border-radius: 5px;
  box-shadow: rgb(0 0 0 / 55%) 0px 20px 68px;
  padding-bottom: 15px;
  background: #121212;
}
.head {
  display: flex;
  flex-direction: row;
  padding: 15px;
  z-index: 2;
}
</style>
