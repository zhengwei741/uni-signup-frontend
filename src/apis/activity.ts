import { request } from '@/utils/request'
import type {
  HotActivity,
  Activity,
  ActivityField,
  ActivityGroup
} from '@/typings/activity'

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

/**
 * 根据活动id查询活动详情
 * @param id
 * @returns
 */
export const queryActivityDetail = (id: string) => {
  return request<API.Result<{ activity: Activity; organizationName: string }>>({
    url: '/activity/mini/queryActivityDetail',
    method: 'POST',
    data: {
      id
    }
  })
}

/**
 * 根据活动id查询活动报名字段
 * @param id
 * @returns
 */
export const queryActivityField = (id: string) => {
  return request<
    API.Result<{ fieldList: ActivityField[]; groupList: ActivityGroup[] }>
  >({
    url: '/activity/mini/queryActivityField',
    method: 'POST',
    data: {
      id
    }
  })
}

/**
 * 删除活动
 * @param id
 * @returns
 */
export const deleteActivity = (id: string) => {
  return request<
    API.Result<{ fieldList: ActivityField[]; groupList: ActivityGroup[] }>
  >({
    url: '/activity/mini/deleteActivity',
    method: 'POST',
    data: {
      id
    }
  })
}

/**
 * 删除自定义字段
 * @param id
 * @returns
 */
export const deleteField = (id: any, activityId: string) => {
  return request<API.Result>({
    url: '/activity/mini/deleteField',
    method: 'POST',
    data: {
      id,
      activityId
    }
  })
}

/**
 * 编辑自定义字段是否必填
 * @param id
 * @returns
 */
export const modifyField = (
  id: any,
  activityId: string,
  requiredFlag: string
) => {
  return request<API.Result>({
    url: '/activity/mini/modifyField',
    method: 'POST',
    data: {
      id,
      activityId,
      requiredFlag
    }
  })
}

/**
 * 编辑活动
 * @returns
 */
export const modifyActivity = (activity: Activity) => {
  return request<API.Result>({
    url: '/activity/mini/modifyActivity',
    method: 'POST',
    data: activity
  })
}

/**
 * 删除组别
 * @returns
 */
export const deleteGroup = (id: any, activityId: string) => {
  return request<API.Result>({
    url: '/activity/mini/deleteGroup',
    method: 'POST',
    data: {
      id,
      activityId
    }
  })
}

/**
 * 更新组别
 * @returns
 */
export const updateGroup = (group: ActivityGroup) => {
  return request<API.Result>({
    url: '/activity/mini/updateGroup',
    method: 'POST',
    data: group
  })
}

/**
 * 分页查询指定创建人的活动
 * @returns
 */
export const queryActivityByCreater = (params: API.Pagination<{
  creater: string
}>) => {
  return request<API.Result>({
    url: '/activity/mini/queryActivityByCreater',
    method: 'POST',
    data: params
  })
}
