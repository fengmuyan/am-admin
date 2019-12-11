import request from '@/utils/request'

// 获取账户通道值
export function getAccountPass() {
  return request({
    url: '/pay/getChannelList',
    method: 'get'
  })
}

// 开通二级账户
export function createAccount(data) {
  return request({
    url: '/pay/reg',
    method: 'post',
    data
  })
}

// 绑卡确认
export function bindCardConfirm(data) {
  return request({
    url: '/pay/confirm',
    method: 'post',
    data
  })
}

// 账户验证码重新发送
export function resentCode(data) {
  return request({
    url: '/pay/smsSend',
    method: 'post',
    data
  })
}


