import request from '@/utils/request'

// 获取产品分类
export function getProCate(data = {}) {
  return request({
    url: '/god/publish/getCmdtClassInfo',
    method: 'post',
    data
  })
}

//根据分类信息获取数据
export function getProData(data = {}) {
  return request({
    url: '/god/publish/publishInit',
    method: 'post',
    data
  })
}

//获取商品展示分类数据
export function getHomePageClass() {
  return request({
    url: '/god/publish/getHomePageClass',
    method: 'get'
  })
}

//获取商品列表
export function getProList(data = {}) {
  return request({
    url: '/god/publish/prduList',
    method: 'post',
    data
  })
}

//获取商品详情
export function getProDetail(data = {}) {
  return request({
    url: '/god/publish/modifyProductInit',
    method: 'post',
    data
  })
}

//商品发布
export function proPublishSub(formData) {
  const data = { formData, $_isFormData: true }
  return request({
    url: '/god/publish/publish',
    method: 'post',
    data,
  })
}

//商品详情中修改
export function proPublishSubEdit(formData) {
  const data = { formData, $_isFormData: true }
  return request({
    url: '/god/publish/modifyProductInfo',
    method: 'post',
    data,
  })
}

//产品删除
export function proPublishDel(formData) {
  const data = { formData, $_isFormData: true }
  return request({
    url: '/god/publish/deleteProduct',
    method: 'post',
    data,
  })
}

//获得大供应商列表
export function getSupplierList(data = {}) {
  return request({
    url: '/god/publish/getPmercodeList',
    method: 'post',
    data,
  })
}









