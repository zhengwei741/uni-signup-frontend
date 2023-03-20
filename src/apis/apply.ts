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
