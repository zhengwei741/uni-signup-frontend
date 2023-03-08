import { request } from '@/utils/request'

type QueryHotActivityParam = API.Pagination<{
  title: string
}>

export interface IHotActivity {
  organizationName: string
  logoImgName: string
  activityStatus: string
  creater: string
  id: string,
  title: string
}
/**
 * 分页查询热门活动
 * @param params 
 * @returns 
 */
export const queryHotActivity = (params: QueryHotActivityParam) => {
  return request<API.PaginationResult<IHotActivity>>({
    url: '/activity/mini/queryHotActivity',
    method: 'POST',
    data: params
  })
}
