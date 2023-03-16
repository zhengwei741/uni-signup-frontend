

export const useUpdateImage = () => {
  const updateImage = () => {
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: 1,
        success: (res) => {
            uni.showLoading({
              title: '上传中'
            })
            uni.uploadFile({
              url: '/api/activity/mini/uploadImg', // 接口地址
              filePath: res.tempFilePaths[0],
              name: 'xxx',
              success(res) {
                // resolve(res.data.path) // 返回线上地址
              },
              fail: reject,
              complete: uni.hideLoading
            })
          resolve(res.tempFilePaths[0])
        },
        fail: reject
      })
    })
  }

  return {
    updateImage
  }
}

