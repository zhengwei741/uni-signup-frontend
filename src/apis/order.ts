import { request } from '@/utils/request'
import type { CashOut } from '@/typings/order'

/**
 * 查询活动金额及提现记录
 * @param params
 * @returns
 */
export const queryActivityAmount = (activityId: string) => {
  return request<API.Result<CashOut>>({
    url: '/order/mini/queryActivityAmount',
    method: 'POST',
    data: {
      activityId
    }
  })
}

/**
 * 提现
 * @param params
 * @returns
 */
export const withdraw = (params: { activityId: string, amount: number }) => {
  return request<API.Result>({
    url: '/order/mini/withdraw',
    method: 'POST',
    data: params
  })
}

/**
 * 增加提现记录
 * @param params
 * @returns
 */
export const insertWithdrawalRecord = (params: { activityId: string, amount: number, platformServiceFee: number, createTime: string }) => {
  return request<API.Result>({
    url: '/order/mini/insertWithdrawalRecord',
    method: 'POST',
    data: params
  })
}
