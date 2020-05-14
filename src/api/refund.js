import request from '@/utils/request'

//退款列表
export function getRefundList(data = {}) {
  return request({
    url: '/god/order/refundList',
    method: 'post',
    data
  })
}

//拒绝申请
export function handelRefuseRefund(data = {}) {
  return request({
    url: '/god/order/refuseRefund',
    method: 'post',
    data
  })
}

//同意申请
export function handelAgreeRefund(data = {}) {
  return request({
    url: '/god/order/agreeRefund',
    method: 'post',
    data
  })
}

//退款操作
export function handelRefund(data = {}) {
  return request({
    url: '/god/order/refund',
    method: 'post',
    data
  })
}



