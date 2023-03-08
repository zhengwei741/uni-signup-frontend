import { login } from '@/apis/common'
import { useCommonStore } from '@/store/common'
import { uuid } from './index'

const SUCCESS_CODE = '0'

const baseUrl = `${import.meta.env.VITE_APP_BASE_URL}`

interface RequestMethod {
  <T = any>(options: UniApp.RequestOptions): Promise<T>
}

// uni.addInterceptor('request', {
//   invoke: async (args) => {
//     if (!args.url.startsWith(baseUrl)) {
//       args.url = `${baseUrl}${args.url}`
//     }
//     args.header = {
//       ...args.header,
//       'content-type': 'application/json',
//       requestId: uuid()
//     }
//     // const { token } = useCommonStore()
//     // debugger
//     // if (!token) {
//     //   // await login()
//     //   return false
//     // }
//     return true
//   }
// })

//@ts-ignore
export const request: RequestMethod = (options: UniApp.RequestOptions) => {
  const { token } = useCommonStore()
  const { url, header } = options

  // return new Promise((resolve, reject) => {
  //   uni.request({
  //     ...options,
  //     success: (ret) => {
  //       // @ts-ignore
  //       const { code } = ret.data
  //       if (code !== SUCCESS_CODE) {
  //         reject(ret.data)
  //         return
  //       }
  //       // @ts-ignore
  //       resolve(ret.data)
  //     },
  //     fail: reject
  //   })
  // })
  debugger
  uni.request(options).onHeadersReceived(() => {
    debugger
  })
}
