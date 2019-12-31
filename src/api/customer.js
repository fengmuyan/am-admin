import request from '@/utils/request'

// 客服入口
export function getCustomer() {
  return request({
    url: '/neatim/customer',
    method: 'get'
  })
}



