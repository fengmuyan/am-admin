import request from '@/utils/request'

//获取首页图表数据
export function handelEsReset() {
  return request({
    url: '/god/restEsIndexes',
    method: 'get'
  })
}