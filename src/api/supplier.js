import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/supplier/list/',
    method: 'get',
    params: query
  })
}

export function fetchActives() {
  return request({
    url: '/supplier/actives/',
    method: 'get',
    params: {}
  })
}

export function fetchSupplierDetail(params) {
  return request({
    url: '/supplier/detail/',
    method: 'get',
    params: params
  })
}

export function fetchSupplierMaterials(params) {
  return request({
    url: '/supplier/materials/',
    method: 'get',
    params: params
  })
}

export function createSupplier(data) {
  return request({
    url: '/supplier/create/',
    method: 'post',
    data: data
  })
}

export function updateSupplier(data) {
  return request({
    url: '/supplier/update/',
    method: 'post',
    data: data
  })
}

export function deleteSupplier(data) {
  return request({
    url: '/supplier/delete/',
    method: 'post',
    data: data
  })
}

export function importSupplierExcel(file) {
  const formData = new FormData() // 创建form对象
  formData.append('file', file)

  return request({
    url: '/supplier/import-file/',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function downloadSupplierExcel(query) {
  return request({
    url: '/supplier/download/',
    method: 'get',
    params: query,
    headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    responseType: 'blob'
  })
}

export function fetchCategoryList(query) {
  return request({
    url: '/material/category/list/',
    method: 'get',
    params: query
  })
}

export function fetchMaterialList(query) {
  return request({
    url: '/material/list/',
    method: 'get',
    params: query
  })
}

export function fetchSupplierInventories(query) {
  return request({
    url: '/supplier/inventories/',
    method: 'get',
    params: query
  })
}