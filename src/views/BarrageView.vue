<template>
  <div class="container">
    <show-block class="barrage-show-block" title="弹幕BarrageView">
      <barrage ref="barrageEl" @onInsertDone="insertDone"/>
    </show-block>
    <el-form ref="form" :model="barrage" label-width="80px" class="barrage-form">
      <el-form-item label="弹幕内容">
        <el-input v-model="barrage.text"></el-input>
      </el-form-item>
      <el-form-item label="弹幕方向">
        <el-radio-group v-model="barrage.direction">
          <el-radio label="向左"></el-radio>
          <el-radio label="中间"></el-radio>
          <el-radio label="向右"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="弹幕样式">
        <el-input type="textarea" placeholder="Eg: color:red; " v-model="barrage.style"></el-input>
      </el-form-item>
    </el-form>
    <el-button-group class="button-group">
      <el-button type="primary" size="small" icon="el-icon-video-play" @click="onPlay">播放</el-button>
      <el-button type="primary" size="small" icon="el-icon-video-pause" @click="onPause">暂停</el-button>
      <el-button type="primary" size="small" icon="el-icon-refresh" @click="toggleShow">显示/隐藏</el-button>
      <el-button type="primary" size="small" icon="el-icon-refresh" @click="clear">清除</el-button>
      <el-button type="primary" size="small" icon="el-icon-s-promotion"  @click="onSendOne">发送1条</el-button>
      <el-button type="primary" size="small" icon="el-icon-s-promotion" @click="onSendTen">发送10条</el-button>
    </el-button-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import Barrage from '@/components/Barrage.vue'
import ShowBlock from '@/components/ShowBlock.vue'

/**
 * 展示弹幕效果
 */
export default defineComponent({
  name: 'BarrageView',
  components: {
    Barrage,
    ShowBlock
  },

  setup () {
    const barrageEl = ref()
    const barrage = reactive({
      text: 'text',
      direction: '向右',
      style: ''
    })
    const onPlay = () => {
      barrageEl.value.play()
    }
    const onPause = () => {
      barrageEl.value.pause()
    }
    const toggleShow = () => {
      barrageEl.value.toggleShow()
    }
    const clear = () => {
      barrageEl.value.clear()
    }
    const insertDone = () => {
      console.log('insertDone')
    }
    const onSendOne = () => {
      console.log(barrage)
    }
    const onSendTen = () => {
      console.log(barrage)
    }
    return {
      barrageEl,
      onPlay,
      onPause,
      toggleShow,
      insertDone,
      onSendOne,
      onSendTen,
      barrage,
      clear
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../assets/mixin';
.container {
  overflow: auto;
  .barrage-show-block {
    margin: 10px 60px 30px;
    height: 80vh;
  }
  .button-group {
    margin: 10px auto 30px;
  }
  .barrage-form {
    margin: 30px 60px;
  }
}
</style>
