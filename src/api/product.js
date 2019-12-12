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






