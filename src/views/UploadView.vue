<template>
  <div class='container'>
    <upload></upload>
    <input type="file" @change="handleFileChange">
    <el-button @click="handleUpload">上传</el-button>
    <el-button @click="handleResume" v-if="showResume">恢复</el-button>
    <el-button
      v-else
      :disabled="isPauseDisable"
      @click="handlePause"
      >暂停</el-button
    >
    <div>
      <div>计算文件 hash</div>
      <el-progress :percentage="hashPercentage"></el-progress>
      <div>总进度</div>
      <el-progress :percentage="uploadPercentage"></el-progress>
    </div>
    <el-table :data="chunks">
      <el-table-column
        prop="hash"
        label="切片hash"
        align="center"
      ></el-table-column>
      <el-table-column label="大小(KB)" align="center" width="120">
        <template v-slot="{ row }">
          {{ row.kbSize }}
        </template>
      </el-table-column>
      <el-table-column label="进度" align="center">
        <template v-slot="{ row }">
          <el-progress
            :percentage="row.progress"
          ></el-progress>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang='ts'>
import { defineComponent, toRefs, reactive, computed } from 'vue'
import Upload from '@/components/UpLoad.vue'

enum Status {
  Waiting,
  Uploading,
  Pause,
}

interface ReqAttr {
  url: string,
  method: string,
  data: FormData | string,
  headers: Record<string, any>,
  onProgress: (this: XMLHttpRequest, ev: ProgressEvent) => any
}

interface ChunkData {
  hash: string,
  chunk: Blob,
  progress: number,
  size: number,
  kbSize: number
}

const CHUNK_SIZE = 10 * 1024 * 1024 // 切片大小

export default defineComponent({
  name: 'UploadView',
  components: {
    Upload
  },
  props: {},
  setup () {
    const data = reactive({
      file: {} as FileList,
      status: Status.Waiting,
      chunks: new Array<ChunkData>(),
      worker: {} as Worker,
      hash: '',
      hashPercentage: 0,
      currentXhrList: new Array<XMLHttpRequest>()
    })
    const resetData = () => {
      data.currentXhrList.forEach(xhr => xhr?.abort())
      data.currentXhrList = []
      if (data.worker) {
        data.worker.onmessage = null
      }
    }
    const uploadPercentage = computed(() => {
      if (!data.file || !data.file.length || !data.chunks.length) return 0
      const loaded = data.chunks
        .map(item => item.size * item.progress)
        .reduce((pre, cur) => pre + cur)
      return parseInt((loaded / data.file[0].size).toFixed(2))
    })

    const isPauseDisable = computed(() => data.status !== Status.Uploading || !data.hash)
    const showResume = computed(() => data.status === Status.Pause)
    const refData = toRefs(data)
    const createHash = async (chunkList: Blob[]) => {
      return new Promise<string>(resolve => {
        data.worker = new Worker('/hash.js')
        data.worker.postMessage({ chunkList })
        data.worker.onmessage = e => {
          const { percentage, hash } = e.data
          data.hashPercentage = percentage
          if (hash) {
            data.hash = hash
            resolve(hash)
          }
        }
      })
    }
    const sliceChunk = async (files: FileList, size: number) => {
      let curSize = 0
      const chunkList = []
      while (curSize < files[0].size) {
        const f = files[0].slice(curSize, curSize + size)
        chunkList.push(f)
        curSize += size
      }
      const hashList = await createHash(chunkList)
      chunkList.forEach((chunk: Blob, index: number) => {
        data.chunks.push({
          hash: `${hashList}-${index}`,
          chunk,
          progress: 0,
          size: chunk.size,
          kbSize: Number((chunk.size / 1024).toFixed(0))
        })
      })
    }

    const request = (attrs: ReqAttr) => {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = attrs.onProgress
        xhr.open(attrs.method, attrs.url)
        Object.keys(attrs.headers).forEach(key => {
          xhr.setRequestHeader(key, attrs.headers[key])
        })
        xhr.send(attrs.data)
        xhr.onload = (e: ProgressEvent) => {
          // 当前xhr请求完成 从数组删除
          if (data.currentXhrList) {
            const xhrIndex = data.currentXhrList.findIndex(item => item === xhr)
            data.currentXhrList.splice(xhrIndex, 1)
          }
          resolve({
            data: (e.target as XMLHttpRequest).response
          })
        }
        // 所有开始的xhr请求保存到数组
        data.currentXhrList.push(xhr)
      })
    }

    const notifyMerge = async () => {
      await request({
        url: 'http://localhost:3000/merge',
        data: JSON.stringify({
          size: CHUNK_SIZE,
          filename: data.file[0].name
        }),
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        onProgress: ev => ev
      })
    }

    const getProgressHandlder = (index: number) => {
      return (ev: ProgressEvent) => {
        console.log(index, 'getProgressHandlder')
        console.log(String((ev.loaded / ev.total) * 100))
        data.chunks[index].progress = parseInt(String((ev.loaded / ev.total) * 100))
      }
    }

    const uploadChunks = async () => {
      const reqList = data.chunks.map((item) => {
        const formData = new FormData()
        formData.append('chunk', item.chunk)
        formData.append('hash', item.hash)
        formData.append('filename', data.file[0].name)
        return formData
      }).map((formData, index) => request({
        url: 'http://localhost:3000',
        data: formData,
        method: 'post',
        headers: {},
        onProgress: getProgressHandlder(index)
      }))
      await Promise.all(reqList)
      await notifyMerge()
    }

    const handleFileChange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files
      if (!file || !file.length) return
      resetData()
      data.file = file
    }

    const handleResume = async () => {
      data.status = Status.Uploading
      // 检查文件是否已上传 || 哪些切片已上传
      await uploadChunks()
    }

    const handlePause = () => {
      data.status = Status.Pause
      resetData()
    }

    const handleUpload = async () => {
      if (!data.file) return
      data.status = Status.Uploading
      // 生成文件切片
      await sliceChunk(data.file, CHUNK_SIZE)
      // 上传切片
      await uploadChunks()
    }

    return {
      ...refData,
      handleFileChange,
      handleUpload,
      uploadPercentage,
      handleResume,
      handlePause,
      isPauseDisable,
      showResume
    }
  }
})
</script>
<style lang='scss' scoped>
.container{
}
</style>
