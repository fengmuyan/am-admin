import request from '@/utils/request'

// 获取订单统计列表
export function getStatisticsOrder(data) {
  return request({
    url: '/god/statistics/order',
    method: 'post',
    data
  })
}

// 获取信用额度账单列表
export function getCreditBill(data) {
  return request({
    url: '/god/creditlimit/creditlimitbill',
    method: 'post',
    data
  })
}

// 获取额度账单详情
export function getCreditBillDetail(data) {
  return request({
    url: '/god/order/billdetaillist',
    method: 'post',
    data
  })
}

// 代卖商品订单列表
export function getAgentOrderList(data) {
  return request({
    url: '/god/order/agentlist',
    method: 'post',
    data
  })
}

// 代卖商品订单明细
export function getAgentOrderDetail(data) {
  return request({
    url: '/god/order/agentdetail',
    method: 'post',
    data
  })
}

// 订单表格导出
export function handelOrderExport(data) {
  return request({
    url: '/god/statistics/export',
    method: 'post',
    data
  })
}

// 信用额度账单表格导出
export function handelQuotaExport(data) {
  return request({
    url: '/god/creditlimit/export',
    method: 'post',
    data
  })
}

// 额度账单明细表格导出
export function handelQuotaDetailExport(data) {
  return request({
    url: '/god/order/billdetailexport',
    method: 'post',
    data
  })
}

// 代卖订单表格导出
export function handelAgentExport(data) {
  return request({
    url: '/god/order/agentexport',
    method: 'post',
    data
  })
}

// 经销商列表
export function getUsernameList() {
  return request({
    url: '/god/creditlimit/userlist',
    method: 'get'
  })
}