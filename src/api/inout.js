import request from '@/utils/request'

export function fetchInoutList(query) {
  return request({
    url: '/inout/list/',
    method: 'get',
    params: query
  })
}

export function fetchInout(query) {
  return request({
    url: '/inout/detail/',
    method: 'get',
    params: query
  })
}

export function reconcileInout(data) {
  return request({
    url: '/inout/reconcile/',
    method: 'post',
    data: data
  })
}

export function deleteInout(data) {
  return request({
    url: '/inout/delete/',
    method: 'post',
    data: data
  })
}

export function createWarehouse(data) {
  return request({
    url: '/inout/warehouse/create/',
    method: 'post',
    data: data
  })
}

export function updateWarehouse(data) {
  return request({
    url: '/inout/warehouse/update/',
    method: 'post',
    data: data
  })
}

export function auditWarehouse(data) {
  return request({
    url: '/inout/warehouse/audit/',
    method: 'post',
    data: data
  })
}

export function payWarehouse(data) {
  return request({
    url: '/inout/warehouse/pay/',
    method: 'post',
    data: data
  })
}

export function fetchPaymentHistory(query) {
  return request({
    url: '/inout/warehouse/pay/history/',
    method: 'get',
    params: query
  })
}

export function createPick(data) {
  return request({
    url: '/inout/pick/create/',
    method: 'post',
    data: data
  })
}

export function updatePick(data) {
  return request({
    url: '/inout/pick/update/',
    method: 'post',
    data: data
  })
}

export function auditPick(data) {
  return request({
    url: '/inout/pick/audit/',
    method: 'post',
    data: data
  })
}

export function createSlip(data) {
  return request({
    url: '/inout/slip/create/',
    method: 'post',
    data: data
  })
}

export function updateSlip(data) {
  return request({
    url: '/inout/slip/update/',
    method: 'post',
    data: data
  })
}

export function auditSlip(data) {
  return request({
    url: '/inout/slip/audit/',
    method: 'post',
    data: data
  })
}

export function createReturn(data) {
  return request({
    url: '/inout/return/create/',
    method: 'post',
    data: data
  })
}

export function updateReturn(data) {
  return request({
    url: '/inout/return/update/',
    method: 'post',
    data: data
  })
}

export function auditReturn(data) {
  return request({
    url: '/inout/return/audit/',
    method: 'post',
    data: data
  })
}

export function downloadInExcel(query) {
  return request({
    url: '/inout/warehouse/export/',
    method: 'get',
    params: query,
    headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    responseType: 'blob'
  })
}

export function downloadReturnExcel(query) {
  return request({
    url: '/inout/return/export/',
    method: 'get',
    params: query,
    headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    responseType: 'blob'
  })
}

export function downloadPickExcel(query) {
  return request({
    url: '/inout/pick/export/',
    method: 'get',
    params: query,
    headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    responseType: 'blob'
  })
}

export function downloadSlipExcel(query) {
  return request({
    url: '/inout/slip/export/',
    method: 'get',
    params: query,
    headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    responseType: 'blob'
  })
}