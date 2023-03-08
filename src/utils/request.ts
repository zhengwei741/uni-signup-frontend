import { useCommonStore } from '@/store/common'
import { uuid } from './index'

const SUCCESS_CODE = '0'

interface RequestMethod {
  <T = any>(options: UniApp.RequestOptions): Promise<T>
}

export const request: RequestMethod = (options: UniApp.RequestOptions) => {
  const { token } = useCommonStore()
  const { url, header } = options

  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      url: `${import.meta.env.VITE_APP_BASE_API}${url}`,
      header: {
        'content-type': 'application/json',
        requestId: uuid(),
        token,
        ...header
      },
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
}
