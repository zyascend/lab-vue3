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
    <div class="overlay" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, reactive, onUnmounted } from 'vue'

interface ILoadingState {
  _id: number,
  text: string,
  class: string,
  opacity: number
}
interface DataProps {
  isDone: boolean
  cycleCurrent: number
  letterCurrent: number
  letters: Array<ILoadingState>
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-_=+{}|[]\\;\':"<>?,./`~'.split('')
const charsLength = chars.length

export default defineComponent({
  name: 'LetterLoading',
  props: {
    text: {
      type: String,
      required: true
    }
  },
  setup (props) {
    let animationFrameID = 0
    let intervalTimer = 0

    const textList: Array<string> = props.text.split('')
    const letterCount = textList.length

    const getInitLetter = (): Array<ILoadingState> => {
      const initLetters: Array<ILoadingState> = []
      textList.forEach((value: string, index: number) => {
        initLetters.push({
          _id: index,
          text: value,
          class: '',
          opacity: 1
        })
      })
      return initLetters
    }
    const data: DataProps = reactive({
      isDone: false,
      cycleCurrent: 0,
      letterCurrent: 0,
      letters: getInitLetter()
    })

    const getRandomChar = (): string => chars[Math.floor(Math.random() * charsLength)]

    const loop = (): void => {
      // 未完成的字随机变一次
      data.letters.forEach((item: ILoadingState, index: number) => {
        if (index >= data.letterCurrent) {
          item.text = getRandomChar()
          item.opacity = Math.random()
        }
      })
      // 未完成的字累计变化5次
      if (data.cycleCurrent < 5) {
        data.cycleCurrent += 1
      } else if (data.letterCurrent < letterCount) {
        // 有一个字将会完成，以后不再变化
        const letter = data.letters[data.letterCurrent]
        letter.text = textList[data.letterCurrent]
        letter.class = 'done'
        letter.opacity = 1

        data.cycleCurrent = 0
        data.letterCurrent += 1
      } else {
        // 所有的字变化完成
        data.isDone = true
      }
      if (!data.isDone) {
        // 还有些字未变化完成 继续循环
        animationFrameID = requestAnimationFrame(() => {
          loop()
        })
      } else {
        // 所有的字变化完成 等待一会 重新开始动画
        intervalTimer = setTimeout(() => {
          reset()
        }, 750)
      }
    }
    const reset = (): void => {
      data.isDone = false
      data.cycleCurrent = 0
      data.letterCurrent = 0
      data.letters = getInitLetter()
      loop()
    }
    onMounted(() => {
      reset()
    })
    onUnmounted(() => {
      clearInterval(intervalTimer)
      cancelAnimationFrame(animationFrameID)
    })
    const refData = toRefs(data)
    return {
      ...refData
    }
  }
})
</script>

<style scoped>
.container {
  position: relative;
}
.words {
  color: #fff;
  font-size: 2.5em;
  height: 2.5em;
  line-height: 2.5em;
  margin: auto;
  text-shadow: 0 0 10px rgba(50, 255, 50, 0.5), 0 0 5px rgba(100, 255, 100, 0.5);
}

.words span {
  display: inline-block;
  width: 0.7em;
  text-align: center;
  transform: translateX(100%) scale(0.9) !important;
  transition: transform 500ms;
}

.words .done {
  color: #6f6;
  transform: translateX(0) scale(1) !important;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  content: '';
  background-image: linear-gradient(transparent 0%, rgba(10, 16, 10, 0.5) 50%);
}

</style>
