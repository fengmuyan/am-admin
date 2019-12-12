import request from '@/utils/request'

// 获取商铺信息
export function getShopDetail() {
  return request({
    url: '/god/store/storeInfoInit',
    method: 'post'
  })
}


