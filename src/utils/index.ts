export { request } from './request'

/**
 * 生成uuid
 * @returns uuid
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getStatusStyle(status:string) {
  return {
    color: status === '报名中' ? '#42b983' : '#6a6a6a',
    'font-size': '13px'
  }
}