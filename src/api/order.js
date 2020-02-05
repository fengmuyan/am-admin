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

// 商品称重
export function orderWeight(data) {
  return request({
    url: '/god/order/weigh',
    method: 'post',
    data
  })
}

//订单列表导出数据
export function orderExport(data) {
  return request({
    url: '/god/order/export',
    method: 'post',
    data
  })
}