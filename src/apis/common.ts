import { useCommonStore } from '@/store/common'
import { uuid } from '@/utils'

// 获取临时登录凭证 code 使用 code 换取 openid 和 session_key 等信息
export const getCode = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      onlyAuthorize: true,
      success: function (loginRes) {
        resolve(loginRes.code)
      },
      fail: function (fail) {
        reject(fail)
      }
    })
  })
}

const baseUrl = `${import.meta.env.VITE_APP_BASE_URL}`

export const loginByCode = async (code: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseUrl}/wxBase/miniLogin`,
      method: 'POST',
      data: { code },
      header: {
        'content-type': 'application/json',
        requestId: uuid()
      },
      success: (ret) => {
        // 存入缓存
        const store = useCommonStore()
        // @ts-ignore
        const { token } = ret.data.data
        store.setToken(token)
        resolve(token)
      },
      fail: reject
    })
  })
}

// 登录
export const login = async () => {
  try {
    const { token } = useCommonStore()
    if (token) {
      return token
    }
    const code = await getCode()
    return await loginByCode(code)
  } catch (error) {
    console.log(error)
  }
}
