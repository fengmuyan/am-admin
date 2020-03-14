import request from '@/utils/request'

//申请列表
export function getApplyList(data = {}) {
  return request({
    url: '/god/thearchy/list',
    method: 'post',
    data
  })
}

//操作申请
export function handelApply(data = {}) {
  return request({
    url: '/god/thearchy/save',
    method: 'post',
    data
  })
}

//申请删除
export function handelApplyDel(data = {}) {
  return request({
    url: '/god/thearchy/delThearchy',
    method: 'post',
    data
  })
}

//货主列表
export function getShipperList() {
  return request({
    url: '/god/thearchy/applyInit',
    method: 'get'
  })
}