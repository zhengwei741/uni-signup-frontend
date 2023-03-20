export { request } from './request'

/**
 * 生成uuid
 * @returns uuid
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getStatusStyle(status: string) {
  return {
    color: status === '报名中' ? '#42b983' : '#6a6a6a',
    'font-size': '13px'
  }
}

export function getMockID() {
  return `mock_${Math.random()}`
}

export function compression(
  file: any,
  size = 1000,
  device = 4
): Promise<{
  file: File | undefined
  origin: File
  beforeSrc: string
  afterSrc: string
  beforeKB: string
  afterKB: any
  detail: any
  quality: any
}> {
  if (file[0]) {
    // @ts-ignore
    return Promise.all(Array.from(file).map((e) => compression(e, size))) // 如果是 file 数组返回 Promise 数组
  } else {
    return new Promise((resolve) => {
      const reader = new FileReader() // 创建 FileReader
      // @ts-ignore
      reader.onload = ({ target: { result: src } }) => {
        const fileSize = Number((file.size / 1024).toFixed(2))
        if (fileSize <= size) {
          resolve({
            file: file,
            origin: file,
            beforeSrc: src,
            afterSrc: src,
            beforeKB: fileSize + 'KB',
            afterKB: fileSize + 'KB',
            detail: [],
            quality: null
          })
        } else {
          const image = new Image() // 创建 img 元素
          image.onload = async () => {
            const canvas = document.createElement('canvas') // 创建 canvas 元素
            canvas.width = image.width
            canvas.height = image.height
            // @ts-ignore
            canvas
              .getContext('2d')
              .drawImage(image, 0, 0, image.width, image.height) // 绘制 canvas
            let canvasURL, miniFile
            let L = true
            let quality = 0
            const detail = []
            let start = Date.now()
            for (let i = 1; i <= device; i++) {
              canvasURL = canvas.toDataURL(
                'image/jpeg',
                L ? (quality += 1 / 2 ** i) : (quality -= 1 / 2 ** i)
              )
              const buffer = atob(canvasURL.split(',')[1])
              let length = buffer.length
              const bufferArray = new Uint8Array(new ArrayBuffer(length))
              while (length--) {
                bufferArray[length] = buffer.charCodeAt(length)
              }
              miniFile = new File([bufferArray], file.name, {
                type: 'image/jpeg'
              })
              if (miniFile.size / 1024 > size) {
                L = false
                // 如果文件还是大于size 增加一次循环次数防止文件大于设置size
                device++
              } else {
                L = true
              }
              detail.push({
                quality,
                size: miniFile.size,
                kb: Number((miniFile.size / 1024).toFixed(2)),
                time: Date.now() - start
              })
              start = Date.now()
            }
            resolve({
              detail,
              quality,
              file: miniFile,
              origin: file,
              beforeSrc: src,
              // @ts-ignore
              afterSrc: canvasURL,
              // @ts-ignore
              beforeKB: Number((file.size / 1024).toFixed(2)),
              // @ts-ignore
              afterKB: Number((miniFile.size / 1024).toFixed(2))
            })
          }
          image.src = src
        }
      }
      reader.readAsDataURL(file)
    })
  }
}
