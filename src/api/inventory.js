import request from '@/utils/request'

export function fetchInventoryList(query) {
  return request({
    url: '/inventory/list/',
    method: 'get',
    params: query
  })
}

export function fetchInventoryBatchList(query) {
  return request({
    url: '/inventory/batch/list/',
    method: 'get',
    params: query
  })
}

export function downloadInventoryExcel(query) {
  return request({
    url: '/inventory/download/',
    method: 'get',
    params: query,
    headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    responseType: 'blob'
  })
}

export function downloadInventoryBatchExcel(query) {
  return request({
    url: '/inventory/batch/download/',
    method: 'get',
    params: query,
    headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    responseType: 'blob'
  })
}

export function fetchInventoryContracts(query) {
  return request({
    url: '/inventory/contracts/',
    method: 'get',
    params: query
  })
}

export function fetchInventoryBasecampOrders(query) {
  return request({
    url: '/inventory/basecamp-orders/',
    method: 'get',
    params: query
  })
}

export function fetchInventoryContractMaterials(query) {
  return request({
    url: '/inventory/contract-materials/',
    method: 'get',
    params: query
  })
}
