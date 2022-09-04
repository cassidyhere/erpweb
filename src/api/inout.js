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

export function auditReturn(data) {
  return request({
    url: '/inout/return/audit/',
    method: 'post',
    data: data
  })
}
