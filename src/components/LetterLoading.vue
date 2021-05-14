<template>
  <div class="container">
    <div class="words">
      <span
      v-for="l in letters"
      :key="l._id"
      :class="l.class"
      :style="{'opacity': `${l.opacity}`}">
      {{l.text}}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface ILoadingState {
  _id: string,
  text: string,
  class: string,
  opacity: number
}

export default defineComponent({
  name: 'LetterLoading',
  props: {
    text: {
      type: String,
      required: true
    }
  },
  data () {
    const letters: Array<ILoadingState> = []
    const textList: Array<string> = this.text.split('')
    textList.forEach((item: string) => {
      letters.push({
        _id: item,
        text: item,
        class: '',
        opacity: 1
      } as ILoadingState)
    })
    return {
      letters
    }
  }
})
</script>

<style scoped>
.container {
  position: relative;
}
.words {
  bottom: 0;
  color: #fff;
  font-size: 2.5em;
  height: 2.5em;
  left: 0;
  line-height: 2.5em;
  margin: auto;
  right: 0;
  position: relative;
  text-shadow: 0 0 10px rgba(50, 255, 50, 0.5), 0 0 5px rgba(100, 255, 100, 0.5);
  top: 0;
}

.words span {
  /* display: inline-block; */
  transform: translateX(100%) scale(0.9);
  transition: transform 500ms;
}

.words .done {
  color: #6f6;
  transform: translateX(0) scale(1);
}

/* .overlay {
  background-image: -webkit-linear-gradient(transparent 0%, rgba(10, 16, 10, 0.5) 50%);
  background-image: linear-gradient(transparent 0%, rgba(10, 16, 10, 0.5) 50%);
  background-size: 1000px 2px;
  bottom: 0;
  content: '';
  left: 0;
  position: absolute;
  right: 0;
  top: 210px;
} */
</style>
