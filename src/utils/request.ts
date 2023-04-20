import { login } from '@/apis/common'
import { useCommonStore } from '@/store/common'
import { uuid } from './index'
import { SUCCESS_CODE, TIME_OUT_CODE } from '@/const'

const baseUrl = `${import.meta.env.VITE_APP_BASE_URL}`

interface RequestMethod {
  <T = any>(options: UniApp.RequestOptions): Promise<T>
}

uni.addInterceptor('request', {
  invoke: (args) => {
    if (!args.url.startsWith(baseUrl)) {
      args.url = `${baseUrl}${args.url}`
    }
    const { token } = useCommonStore()
    args.header = {
      'content-type': 'application/json',
      requestId: uuid(),
      token,
      ...args.header
    }
  }
})

const requestStack: string[] = []

function showLoading(url: string) {
  if (!requestStack.length) {
    uni.showLoading({})
  }
  requestStack.push(url)
}

function hideLoading() {
  requestStack.pop()
  if (!requestStack.length) {
    uni.hideLoading()
  }
}

export const request: RequestMethod = (options: UniApp.RequestOptions) => {
  return new Promise((resolve, reject) => {
    showLoading(options.url)

    login()
      .then(() => {
        uni.request({
          ...options,
          success: (ret) => {
            // @ts-ignore
            const { code, msg } = ret.data
            if (code !== SUCCESS_CODE) {
              hideLoading()
              uni.showToast({ title: msg, icon: 'none' })
              reject(ret.data)
              return
            }
            // token超时
            if (code === TIME_OUT_CODE) {
              const { setToken } = useCommonStore()
              setToken('')
              uni.switchTab({
                url: '/pages/hot/index'
              })
              hideLoading()
              reject(ret.data)
              return
            }
            hideLoading()
            // @ts-ignore
            resolve(ret.data)
          },
          fail(ret) {
            hideLoading()
            reject(ret)
          }
        })
      })
      .catch(() => {
        hideLoading()
      })
  })
}
