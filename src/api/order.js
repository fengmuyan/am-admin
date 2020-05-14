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

//物流公司列表
export function getExpressList(data) {
  return request({
    url: '/god/order/getExpressList',
    method: 'post',
    data
  })
}

//发货
export function handelSendGoods(data) {
  return request({
    url: '/god/order/sendGoods',
    method: 'post',
    data
  })
}

//调价
export function handelEditPrice(data) {
  return request({
    url: '/god/order/modifyOrderDetailPrice',
    method: 'post',
    data
  })
}

//发货获取明细
export function getOrderDetailsList(data) {
  return request({
    url: '/god/order/getOrderDetailsList',
    method: 'post',
    data
  })
}

//订单发货列表
export function getOrderExpressInfo(data) {
  return request({
    url: '/god/order/getOrderExpressInfo',
    method: 'post',
    data
  })
}

//修改发货信息
export function handelEditExpressInfo(data) {
  return request({
    url: '/god/order/modifyOrderExpressInfo',
    method: 'post',
    data
  })
}

//删除发货信息
export function handelDelExpressInfo(data) {
  return request({
    url: '/god/order/delOrderExpressInfo',
    method: 'post',
    data
  })
}

//物流追踪
export function getKdnExpressInfo(data) {
  return request({
    url: '/god/order/getKdnExpressInfo',
    method: 'post',
    data
  })
}
//快递公司列表
export function getExpressModelList(data = {}) {
  return request({
    url: '/god/order/getExpressModelList',
    method: 'post',
    data
  })
}

//代发的列表
export function getDeliverOrderList(data = {}) {
  return request({
    url: '/god/order/deliverOrderlist',
    method: 'post',
    data
  })
}

// 发货列表修改
export function getAllowSentNum(data = {}) {
  return request({
    url: '/god/order/modifyOrderExpressInfoInit',
    method: 'post',
    data
  })
}

//快递模板导出
export function handelExportExpress(data = {}) {
  return request({
    url: '/god/order/deliverOrderexport',
    method: 'post',
    data,
  })
}

//账单抹账列表
export function getWipeList(data = {}) {
  return request({
    url: '/god/order/wipeList',
    method: 'post',
    data,
  })
}

//账单抹账验证码发送
export function handelWipeSendCode(data = {}) {
  return request({
    url: '/god/order/wipeAccountsSmsCode',
    method: 'post',
    data,
  })
}

//账单抹账操作
export function handelWipeAccounts(data = {}) {
  return request({
    url: '/god/order/wipeAccounts',
    method: 'post',
    data,
  })
}
