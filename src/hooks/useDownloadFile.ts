import { URL } from '@/const'

export const useDownloadFile = (
  url: string,
  fileName: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url: `${URL}${url}`,
      success(res) {
        const { tempFilePath } = res
        const manager = uni.getFileSystemManager()
        manager.saveFile({
          tempFilePath,
          // @ts-ignore
          filePath: `${wx.env.USER_DATA_PATH}/${fileName}`,
          success({ savedFilePath }) {
            resolve(savedFilePath)
          },
          fail: reject
        })
      },
      fail: reject
    })
  })
}
