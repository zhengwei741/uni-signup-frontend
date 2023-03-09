import { login } from '@/apis/common'
import { useCommonStore } from '@/store/common'
import { uuid } from './index'
import { SUCCESS_CODE } from '@/const'

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
      ...args.header,
      'content-type': 'application/json',
      requestId: uuid(),
      token
    }
  }
})

export const request: RequestMethod = (options: UniApp.RequestOptions) => {
  return new Promise((resolve, reject) => {
    login().then(() => {
      uni.request({
        ...options,
        success: (ret) => {
          // @ts-ignore
          const { code } = ret.data
          if (code !== SUCCESS_CODE) {
            reject(ret.data)
            return
          }
          // @ts-ignore
          resolve(ret.data)
        },
        fail: reject
      })
    })
  })
}
