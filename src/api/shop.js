import request from '@/utils/request'

// 获取商铺信息
export function getShopDetail() {
  return request({
    url: '/god/store/storeInfoInit',
    method: 'post'
  })
}

// 修改商铺基本信息和图片
export function editBaseImgInfo(formData) {
  const data = { formData, $_isFormData: true }
  return request({
    url: '/god/store/modifyStoreInfo',
    method: 'post',
    data,
  })
}





