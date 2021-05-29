<template>
  <div class='container'>
    <upload></upload>
    <input type="file" @change="handleFileChange">
  </div>
</template>
<script lang='ts'>
import { defineComponent, toRefs, reactive, computed } from 'vue'
import Upload from '@/components/UpLoad.vue'

enum Status {
  Waiting,
  Uploading,
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
  size: number
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
      chunks: new Array<ChunkData>()
    })
    const uploadPercentage = computed(() => {
      if (!data.file || !data.file.length || !data.chunks.length) return 0
      const loaded = data.chunks
        .map(item => item.size * item.progress)
        .reduce((acc, cur) => acc + cur)
      return parseInt((loaded / data.file[0].size).toFixed(2))
    })
    const refData = toRefs(data)

    const sliceChunk = (files: FileList, size: number) => {
      let curSize = 0
      let index = 0
      const filename = files[0].name
      while (curSize < files[0].size) {
        const f = files[0].slice(curSize, curSize + size)
        data.chunks.push({
          chunk: f,
          hash: `${filename}-${index}`,
          progress: 0,
          size: f.size
        })
        curSize += size
        index++
      }
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
          resolve({
            data: (e.target as XMLHttpRequest).response
          })
        }
      })
    }
    const notifyMerge = async () => {
      await request({
        url: 'http://localhost:3000/merge',
        data: JSON.stringify({
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
      if (file) {
        data.file = file
      }
    }
    const handleUpload = async () => {
      if (!data.file) return
      data.status = Status.Uploading
      // 生成文件切片
      sliceChunk(data.file, CHUNK_SIZE)
      // 上传切片
      await uploadChunks()
    }
    return {
      ...refData,
      handleFileChange,
      handleUpload,
      uploadPercentage
    }
  }
})
</script>
<style lang='scss' scoped>
.container{
}
</style>
