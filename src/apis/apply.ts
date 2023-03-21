import { request } from '@/utils/request'
import type { Apply } from '@/typings/apply'
/**
 * 根据活动Id查询所有报名
 * @param params
 * @returns
 */
export const queryAllApply = (activityId: string) => {
  return request<API.Result<{ allApplyList: Apply[] }>>({
    url: '/apply/mini/queryAllApply',
    method: 'POST',
    data: {
      activityId
    }
  })
}

/**
 * 新增报名
 * @param params
 * @returns
 */
export const insertApply = (params: any) => {
  return request<API.Result>({
    url: '/apply/mini/insertApply',
    method: 'POST',
    data: params
  })
}

/**
 * 查询所有取消报名人员
 * @param params
 * @returns
 */
export const queryCancelApply = (activityId: string) => {
  return request<API.Result<{ cancelList: Apply[] }>>({
    url: '/apply/mini/queryCancelApply',
    method: 'POST',
    data: {
      activityId
    }
  })
}

/**
 * 根据活动Id查询我的报名
 * @param params
 * @returns
 */
export const queryMyApply = (activityId: string) => {
  return request<API.Result<{ myApplyList: Apply[] }>>({
    url: '/apply/mini/queryMyApply',
    method: 'POST',
    data: {
      activityId
    }
  })
}
