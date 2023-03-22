import type { PayRet } from '@/typings/apply'

export const usePay = async (payRet: PayRet) => {
  return new Promise((resolve, reject) => {
    uni.requestPayment({
      provider: 'wxpay',
      orderInfo: payRet,
      ...payRet,
      success: resolve,
      fail: reject
    })
  })
}
