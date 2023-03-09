export interface IActivity {
  name: string
  id: Number
}

/**
 * 热门活动
 */
export interface IHotActivity {
  organizationName: string
  logoImgName: string
  activityStatus: string
  creater: string
  id: string,
  title: string
}