self.importScripts('/spark-md5.min.js') // 导入脚本
// 生成文件 hash
self.onmessage = e => {
  console.log(e)
  const { chunkList } = e.data
  const spark = new self.SparkMD5.ArrayBuffer()
  let percentage = 0
  let count = 0
  const loadNext = index => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(chunkList[index])
    reader.onload = e => {
      count++
      spark.append(e.target.result)
      if (count === chunkList.length) {
        const h = spark.end()
        console.log(h)
        self.postMessage({
          percentage: 100,
          hash: h
        })
        self.close()
      } else {
        percentage += 100 / chunkList.length
        self.postMessage({
          percentage
        })
        loadNext(count)
      }
    }
  }
  loadNext(0)
}
