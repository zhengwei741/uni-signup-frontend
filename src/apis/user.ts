import { request } from '@/utils/request'
import type { BizInfo } from '@/typings/user'

/**
 * 查询商家个人信息
 * @param params
 * @returns
 */
export const queryBizInfo = (creater: string) => {
  return request<API.Result<BizInfo>>({
    url: '/user/mini/queryBizInfo',
    method: 'POST',
    data: {
      creater
    }
  })
}

/**
 * 商家用户上传Logo图片
 * @param params
 * @returns
 */
export const uploadLogo = () => {
  return request({
    url: '/activity/mini/uploadLogo',
    method: 'POST',
    data: {}
  })
}
