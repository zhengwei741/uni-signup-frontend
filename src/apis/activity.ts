import { request } from '@/utils/request'
import type { HotActivity, Activity } from '@/typings/activity'

type QueryHotActivityParam = API.Pagination<{
  title: string
}>

/**
 * 分页查询热门活动
 * @param params
 * @returns
 */
export const queryHotActivity = (params: QueryHotActivityParam) => {
  return request<API.PaginationResult<HotActivity>>({
    url: '/activity/mini/queryHotActivity',
    method: 'POST',
    data: params
  })
}

/**
 * 商家分页查询活动
 * @param pageNo
 * @param pageSize
 * @returns
 */
export const queryActivityByBiz = (params: API.Pagination<{}>) => {
  return request<API.PaginationResult<HotActivity>>({
    url: '/activity/mini/queryActivityByBiz',
    method: 'POST',
    data: params
  })
}

/**
 * 新增活动
 * @param activity
 * @returns
 */
export const insertActivity = (activity: Activity) => {
  return request<API.PaginationResult<HotActivity>>({
    url: '/activity/mini/insertActivity',
    method: 'POST',
    data: activity
  })
}
