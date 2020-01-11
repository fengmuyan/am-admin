import request from '@/utils/request'

// 客服入口
export function getCustomer() {
  return request({
    url: '/neatim/customer',
    method: 'get'
  })
}

// 回复信息获取
export function getReplyList() {
  return request({
    url: '/neatim/rebotreply',
    method: 'get'
  })
}

// 回复信息设置
export function setReply(data) {
  return request({
    url: '/neatim/editRebotreply',
    method: 'post',
    data
  })
}