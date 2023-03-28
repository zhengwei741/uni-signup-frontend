import { URL } from '@/const'

export const useDownloadFile = (
  url: string,
  fileName: string
): Promise<{ savedFilePath: string, fileUrl:string }> => {
  return new Promise((resolve, reject) => {
    const fileUrl = `${URL}/${url}`
    uni.downloadFile({
      url: fileUrl,
      success(res) {
        const { tempFilePath } = res
        const manager = uni.getFileSystemManager()
        manager.saveFile({
          tempFilePath,
          // @ts-ignore
          filePath: `${wx.env.USER_DATA_PATH}/${fileName}`,
          success({ savedFilePath }) {
            resolve({
              fileUrl,
              savedFilePath
            })
          },
          fail: reject
        })
      },
      fail: reject
    })
  })
}
