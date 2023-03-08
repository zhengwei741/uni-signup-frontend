import { useCommonStore } from '@/store/common'
import { request } from '@/utils/request'

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

export const loginByCode = async (code: string): Promise<string> => {
  const { data } = await request<API.Result<{ token: string }>>({
    url: '/wxBase/miniLogin',
    method: 'POST',
    data: { code }
  })
  // 存入缓存
  const store = useCommonStore()
  store.setToken(data.token)
  return data.token
}

// 登录
export const login = async () => {
  try {
    const code = await getCode()
    return await loginByCode(code)
  } catch (error) {
    console.log(error)
  }
}
