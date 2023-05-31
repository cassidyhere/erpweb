import request from '@/utils/request'

export function fetchContractList(query) {
  return request({
    url: '/purchase/contract/list/',
    method: 'get',
    params: query
  })
}

export function fetchContractExecuting() {
  return request({
    url: '/purchase/contract/executing/',
    method: 'get'
  })
}

export function fetchContract(query) {
  return request({
    url: '/purchase/contract/detail/',
    method: 'get',
    params: query
  })
}

export function fetchContractInfo(query) {
  return request({
    url: '/purchase/contract/info/',
    method: 'get',
    params: query
  })
}

export function fetchContractSuppliers() {
  return request({
    url: '/purchase/contract/suppliers/',
    method: 'get'
  })
}

export function fetchPurchasedEngineers() {
  return request({
    url: '/purchase/engineer/',
    method: 'get'
  })
}

export function createContract(data) {
  return request({
    url: '/purchase/contract/create/',
    method: 'post',
    data: data
  })
}

export function updateContract(data) {
  return request({
    url: '/purchase/contract/update/',
    method: 'post',
    data: data
  })
}

export function finishContract(data) {
  return request({
    url: '/purchase/contract/finish/',
    method: 'post',
    data: data
  })
}

export function auditContract(data) {
  return request({
    url: '/purchase/contract/audit/',
    method: 'post',
    data: data
  })
}

export function deleteContract(data) {
  return request({
    url: '/purchase/contract/delete/',
    method: 'post',
    data: data
  })
}

export function importContractExcel(file) {
  const formData = new FormData() // 创建form对象
  formData.append('file', file)

  return request({
    url: 'purchase/contract/upload/',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}


export function fetchOrderList(query) {
  return request({
    url: '/purchase/order/list/',
    method: 'get',
    params: query
  })
}

export function fetchWarehousingOrderList(query) {
  return request({
    url: '/purchase/order/warehousing/',
    method: 'get',
    params: query
  })
}

export function fetchOrderNames(query) {
  return request({
    url: '/purchase/order/names/',
    method: 'get',
    params: query
  })
}

export function fetchOrder(query) {
  return request({
    url: '/purchase/order/detail/',
    method: 'get',
    params: query
  })
}

export function createOrder(data) {
  return request({
    url: '/purchase/order/create/',
    method: 'post',
    data: data
  })
}

export function updateOrder(data) {
  return request({
    url: '/purchase/order/update/',
    method: 'post',
    data: data
  })
}

export function auditOrder(data) {
  return request({
    url: '/purchase/order/audit/',
    method: 'post',
    data: data
  })
}

export function deleteOrder(data) {
  return request({
    url: '/purchase/order/delete/',
    method: 'post',
    data: data
  })
}

export function importOrderExcel(file) {
  const formData = new FormData() // 创建form对象
  formData.append('file', file)

  return request({
    url: 'purchase/order/import-file/',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function fetchOrderMaterialList(query) {
  return request({
    url: '/purchase/order-material/list/',
    method: 'get',
    params: query
  })
}

export function createOrderMaterial(data) {
  return request({
    url: '/purchase/order-material/create/',
    method: 'post',
    data: data
  })
}

export function updateOrderMaterial(data) {
  return request({
    url: '/purchase/order-material/update/',
    method: 'post',
    data: data
  })
}

export function importOrderMaterialExcel(file) {
  const formData = new FormData() // 创建form对象
  formData.append('file', file)

  return request({
    url: '/purchase/order-material/import-file/',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function downloadOrderExcel(query) {
  return request({
    url: '/purchase/order/export/',
    method: 'get',
    params: query,
    headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    responseType: 'blob'
  })
}


export function downloadContractExcel(query) {
  return request({
    url: '/purchase/contract/export/',
    method: 'get',
    params: query,
    headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    responseType: 'blob'
  })
}

export function fetchPurchaseList(query) {
  return request({
    url: '/purchase/list/',
    method: 'get',
    params: query
  })
}

export function downloadPurachaseExcel(query) {
  return request({
    url: '/purchase/list/export/',
    method: 'get',
    params: query,
    headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    responseType: 'blob'
  })
}
