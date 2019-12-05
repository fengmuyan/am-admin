import request from '@/utils/request'

// 登录方法
export function login(username, password, randstr, ticket) {
  const data = {
    username,
    password,
    ticket,
    randstr
  }
  return request({
    url: '/login',
    method: 'post',
    params: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function validateCapt(data) {
  return request({
    url: '/mounttai/register/sendSmsCode',
    method: 'post',
    data
  })
}

// 审核验证码提交
export function submitCapt(data) {
  return request({
    url: '/mounttai/register/checkSmsCode',
    method: 'post',
    data
  })
}

// 账号信息提交
export function submitAccountInfo(data) {
  return request({
    url: '/mounttai/register/inputUserInfo',
    method: 'post',
    data
  })
}


