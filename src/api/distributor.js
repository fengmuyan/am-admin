import request from '@/utils/request'

// 经销商首次授权验证本人身份发送验证码
export function sendSmsCode() {
  return request({
    url: '/god/creditlimit/sendSmsCode',
    method: 'get'
  })
}

// 经销商首次授权核对本人验证码
export function checkMerSmsCode(data) {
  return request({
    url: '/god/creditlimit/checkMerSmsCode',
    method: 'post',
    data
  })
}

// 查询经销商信息
export function queryUserInfo(data) {
  return request({
    url: '/god/creditlimit/queryUserInfo',
    method: 'post',
    data
  })
}

// 经销商短信验证码
export function sendUserSmsCode(data) {
  return request({
    url: '/god/creditlimit/sendUserSmsCode',
    method: 'post',
    data
  })
}


// 校验经销商验证码
export function checkUserSmsCode(data) {
  return request({
    url: '/god/creditlimit/checkUserSmsCode',
    method: 'post',
    data
  })
}

//插入信用额度
export function save(data) {
  return request({
    url: '/god/creditlimit/save',
    method: 'post',
    data
  })
}

//查询授权信用额度列表
export function list(data = {}) {
  return request({
    url: '/god/creditlimit/list',
    method: 'post',
    data
  })
}

//修改信用额度
export function updateCreditLimit(data) {
  return request({
    url: '/god/creditlimit/updateCreditLimit',
    method: 'post',
    data
  })
}

//修改折扣
export function updateDiscount(data) {
  return request({
    url: '/god/creditlimit/updateDiscount',
    method: 'post',
    data
  })
}