<template>
  <div class='container'>
    <upload></upload>
    <input type="file" @change="handleFileChange">
  </div>
</template>
<script lang='ts'>
import { defineComponent, toRefs, reactive } from 'vue'
import Upload from '@/components/UpLoad.vue'

enum Status {
  Waiting,
  Uploading,
}

interface ReqAttr {
  url: string,
  method: string,
  data: FormData | string,
  headers: Record<string, any>
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
      hashs: [''],
      chunkList: [] as Array<Blob>
    })
    const refData = toRefs(data)
    const createChunkList = (file: FileList, size: number): Array<Blob> => {
      const chunkList = []
      let curSize = 0
      while (curSize < file[0].size) {
        chunkList.push(file[0].slice(curSize, curSize + size))
        curSize += size
      }
      return chunkList
    }

    const createHash = (chunkList: Array<Blob>) => {
      const hashs = Array.from({ length: chunkList.length }, index => `${index}`)
      return hashs
    }
    const request = (attrs: ReqAttr) => {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
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
        }
      })
    }
    const uploadChunks = async () => {
      const reqList = data.chunkList.map((chunk, index) => {
        const formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('hash', data.hashs[index])
        formData.append('filename', data.file[0].name)
        return formData
      }).map(formData => request({
        url: 'http://localhost:3000',
        data: formData,
        method: 'post',
        headers: {}
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
      data.chunkList = createChunkList(data.file, CHUNK_SIZE)
      // 生成每个切片的hash
      data.hashs = createHash(data.chunkList)
      // 上传切片
      await uploadChunks()
    }
    return {
      ...refData,
      handleFileChange,
      handleUpload
    }
  }
})
</script>
<style lang='scss' scoped>
.container{
}
</style>
