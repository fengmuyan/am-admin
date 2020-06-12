import request from '@/utils/request'

// 获取账户通道值
export function getAccountPass() {
  return request({
    url: '/god/account/getChannelList',
    method: 'get'
  })
}

// 开通二级账户
export function createAccount(data = {}) {
  return request({
    url: '/god/account/reg',
    method: 'post',
    data,
  })
}

// 绑卡确认
export function bindCardConfirm(data = {}) {
  return request({
    url: '/god/account/confirm',
    method: 'post',
    data
  })
}

// 账户验证码重新发送
export function resentCode(data) {
  return request({
    url: '/god/account/smsSend',
    method: 'post',
    data
  })
}

// 提现账户列表
export function withdrawalAccountList() {
  return request({
    url: '/god/account/getAccountList',
    method: 'get'
  })
}

// 提现验证身份验证码发送
export function withdrawalCode() {
  return request({
    url: '/god/account/sendSmsCode',
    method: 'get'
  })
}

// 提现验证身份验证码核对下一步
export function withdrawalCheckCode(data) {
  return request({
    url: '/god/account/checkMerSmsCode',
    method: 'post',
    data
  })
}

// 提现验证身份验证码核对下一步
export function withdrawal(data) {
  return request({
    url: '/god/account/cashOut',
    method: 'post',
    data
  })
}

// 流水列表
export function getAccountFlowList(data = {}) {
  return request({
    url: '/god/account/changelist',
    method: 'post',
    data
  })
}

// 流水导出
export function handelAccountFlowExport(data = {}) {
  return request({
    url: '/god/account/changeexport',
    method: 'post',
    data
  })
}



