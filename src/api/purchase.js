import request from '@/utils/request'

// 获取仓库中的商品
export function getStoreCmdtList(data) {
  return request({
    url: '/god/rt/storeCmdtList',
    method: 'post',
    data
  })
}

// 获取字典（产地，品级）列表
export function getDictList(data) {
  return request({
    url: '/god/rt/sys/dictList',
    method: 'post',
    data
  })
}


// （产地，品级）列表删除
export function handelDelDict(data) {
  return request({
    url: '/god/rt/sys/delDict',
    method: 'post',
    data
  })
}

// （产地，品级）列表新增修改
export function handelSaveDict(data) {
  return request({
    url: '/god/rt/sys/saveDict',
    method: 'post',
    data
  })
}

// 获取采购员列表
export function getPuruserList() {
  return request({
    url: '/god/rt/puruserList',
    method: 'get'
  })
}

// 获取采购单列表
export function getPurchaseList(data) {
  return request({
    url: '/god/rt/purchaseList',
    method: 'post',
    data
  })
}

// 采购单和添加
export function handelSaveOrder(formData) {
  const data = { formData, $_isFormData: true }
  return request({
    url: '/god/rt/savePurchaseOrder',
    method: 'post',
    data
  })
}

// 采购单添加（修改添加）
export function handelSaveEditOrder(data) {
  return request({
    url: '/god/rt/modifyPurchaseState',
    method: 'post',
    data
  })
}

// 打税公司工厂表（不分页）
export function getTaxfactoryList(data = {}) {
  return request({
    url: '/god/rt/sys/taxfactoryList',
    method: 'post',
    data
  })
}

// 打税公司删除
export function handelDelTaxfactory(data) {
  return request({
    url: '/god/rt/sys/delTaxfactory',
    method: 'post',
    data
  })
}

// 打税公司新增修改
export function handelSaveTaxfactory(data) {
  return request({
    url: '/god/rt/sys/saveTaxfactory',
    method: 'post',
    data
  })
}

// 采购单详情初始化
export function getPurDetail(data) {
  return request({
    url: '/god/rt/modifyPurchaseOrderInit',
    method: 'post',
    data
  })
}

// 采购单详情修改保存
export function handelEditPur(formData) {
  const data = { formData, $_isFormData: true }
  return request({
    url: '/god/rt/modifyPurchaseOrder',
    method: 'post',
    data
  })
}

// 采购单详情修改保存
export function handelPurListExport(data) {
  return request({
    url: '/god/rt/exportPurchaseList',
    method: 'post',
    data
  })
}


