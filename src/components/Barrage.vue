<template>
  <div class="barrage-container" ref="containerEl">
    <div class="barrages" ref="dmContainerEl"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, toRefs, ref, reactive, nextTick, computed } from 'vue'
import BarrageLists from '../mock'

interface IContainerSize {
  width: number,
  height: number
}
export default defineComponent({
  name: 'Barrage',
  props: {
    title: String,
    randomChannel: {
      type: Boolean,
      default: true
    },
    insertFreq: {
      type: Number,
      default: 100
    },
    loop: {
      type: Boolean,
      default: true
    },
    channels: {
      type: Number,
      default: 0
    },
    verticalPadding: {
      type: Number,
      default: 4
    }
  },
  setup (props, context) {
    const containerEl = ref<HTMLDivElement>({} as HTMLDivElement)
    const dmContainerEl = ref<HTMLDivElement>({} as HTMLDivElement)
    let containerSize: IContainerSize = {} as IContainerSize
    let insertedCount = 0
    let timer = 0

    const data = reactive({
      barrageList: BarrageLists,
      currentChannel: 0,
      paused: false
    })
    const barrageCount = computed(() => {
      return data.barrageList.length
    })
    const init = () => {
      containerSize = {
        width: containerEl.value.offsetWidth,
        height: containerEl.value.offsetHeight
      }
    }
    const insertBarrage = () => {
      // 使用any规避 【Cannot assign to 'style' because it is a read-only property.】错误
      const barrage: any = document.createElement('div')
      const barrageData = data.barrageList[insertedCount]
      barrage.style = barrageData.style
      // @TODO 防止HTML注入
      barrage.innerHTML = barrageData.text
      barrage.classList.add('barrage')
      dmContainerEl.value.appendChild(barrage)
      nextTick(() => {
        const height = barrage.offsetHeight
        const width = barrage.offsetWidth
        const channels = props.channels || Math.floor(containerSize.height / (height + props.verticalPadding + 2))

        let channelIndex = 0
        if (props.randomChannel) {
          channelIndex = Math.floor(Math.random() * (channels + 1))
        } else {
          channelIndex = data.currentChannel % channels
          data.currentChannel++
        }
        barrage.style.animationDuration = '6s'
        barrage.style.top = `${channelIndex * (height + props.verticalPadding)}px`
        barrage.style.width = `${width}px`
        if (barrageData.direction === 'mid') {
          barrage.style.left = '50%'
          barrage.classList.add('mid')
        } else if (barrageData.direction === 'reverse') {
          barrage.classList.add('move-to-right')
          barrage.style.setProperty('--barrage-right-offset', `${containerSize.width}px`)
        } else {
          barrage.classList.add('move-to-left')
          barrage.style.setProperty('--barrage-left-offset', `-${containerSize.width}px`)
        }
        barrage.dataset.index = String(insertedCount)
        barrage.addEventListener('animationend', () => {
          dmContainerEl.value.removeChild(barrage)
        })
        if (barrage.classList.length > 0) {
          insertedCount++
        }
      })
    }
    const show = () => {
      data.paused = false
      if (!timer) {
        nextTick(() => {
          timer = setInterval(() => {
            if (!data.paused && data.barrageList.length) {
              if (insertedCount < barrageCount.value) {
                insertBarrage()
              } else {
                if (props.loop) {
                  insertedCount = 0
                  insertBarrage()
                }
                // 所有弹幕插入完成 通知父组件
                // 注意 loop==true 会通知多次
                context.emit('onInsertDone')
              }
            }
          }, props.insertFreq)
        })
      }
    }
    onMounted(() => {
      init()
      show()
    })
    onUnmounted(() => {
      insertedCount = 0
      clearInterval(timer)
    })
    const refData = toRefs(data)
    return {
      ...refData,
      containerEl,
      dmContainerEl
    }
  }
})
</script>

<style lang="scss">
@import '../assets/mixin';
.barrage-container {
  position: relative;
  overflow: hidden;
  @include wh100;
  .barrages {
    @include wh100;
    @include abs00;
    opacity: 1;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    &.show {
      opacity: 1;
    }
    &.paused {
      .barrage.move-to-left.mid.move-to-right {
        animation-play-state: paused;
      }
    }
    .barrage {
      position: absolute;
      right: 0;
      font-size: 20px;
      color: #fff;
      white-space: pre;
      transform: translateX(100%);
      &.move-to-left,&.move-to-right,&.mid {
        will-change: transform;
        animation-timing-function: linear;
        animation-play-state: running;
      }
      &.move-to-left {
        animation-name: moveLeft;
      }
      &.move-to-right {
        left: 0;
        animation-name: moveRight;
      }
      &.mid {
        animation-name: mid-show;
      }
      &.pause {
        animation-play-state: paused;
        z-index: 10;
      }
    }
    @keyframes mid-show {
      from {
        transform: translateX(-50%);
      }
      to {
        transform: translateX(-50%);
      }
    }
    @keyframes moveLeft {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(var(--barrage-left-offset));
      }
    }
    @keyframes moveRight {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(var(--barrage-right-offset));
      }
    }
  }
}
</style>
