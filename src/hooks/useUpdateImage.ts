import { URL } from '@/const'
import { uuid } from '@/utils'
import { login } from '@/apis/common'
import { SUCCESS_CODE } from '@/const'

export const useUpdateImage = (url: string) => {
  const updateImage = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      login().then((token: string) => {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            // @ts-ignore
            const uploadFile = res.tempFiles[0]
            if (uploadFile.size >= 10240) {
              reject('图片不能大于10M')
            }
            uni.compressImage({
              src: res.tempFilePaths[0],
              quality: 50,
              success(ret) {
                uni.showLoading({ title: '上传中' })
                uni.uploadFile({
                  url: `${URL}${url}`, // 接口地址
                  filePath: ret.tempFilePath,
                  name: 'file',
                  header: {
                    requestId: uuid(),
                    token
                  },
                  success(res) {
                    const data = JSON.parse(res.data)
                    if (data.code === SUCCESS_CODE) {
                      resolve(
                        `${URL}/${data.data.imgPath || data.data.logoPath}`
                      )
                    } else {
                      reject()
                    }
                  },
                  fail: reject,
                  complete: uni.hideLoading
                })
              },
              fail: reject
            })
          },
          fail: reject
        })
      })
    })
  }

  return {
    updateImage
  }
}
