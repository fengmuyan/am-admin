import request from '@/utils/request'

// 获取订单信息
export function getOrderList(data) {
  return request({
    url: '/god/order/list',
    method: 'post',
    data
  })
}

// 商品发货
export function orderToSent(data) {
  return request({
    url: '/god/order/sendGoods',
    method: 'post',
    data
  })
}

// 获取详情
export function getOrderDetail(data) {
  return request({
    url: '/god/order/detail',
    method: 'post',
    data
  })
}
