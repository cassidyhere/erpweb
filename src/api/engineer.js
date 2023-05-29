import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/engineer/list/',
    method: 'get',
    params: query
  })
}

export function fetchBuildingList(query) {
  return request({
    url: '/engineer/building/',
    method: 'get',
    params: query
  })
}

export function fetchHasPick(query) {
  return request({
    url: '/engineer/has-pick/',
    method: 'get',
    params: query
  })
}

export function fetchPickedMaterials(query) {
  return request({
    url: '/engineer/picked-materials/',
    method: 'get',
    params: query
  })
}

export function fetchEngineerStats(query) {
  return request({
    url: '/engineer/stats/',
    method: 'get',
    params: query
  })
}

export function fetchEngineer(data) {
  return request({
    url: '/engineer/detail/',
    method: 'get',
    params: data
  })
}

export function createEngineer(data) {
  return request({
    url: '/engineer/create/',
    method: 'post',
    data: data
  })
}

export function deleteEngineer(data) {
  return request({
    url: '/engineer/delete/',
    method: 'post',
    data: data
  })
}

export function modifyEngineer(data) {
  return request({
    url: '/engineer/modify/',
    method: 'post',
    data: data
  })
}

export function auditEngineer(data) {
  return request({
    url: '/engineer/audit/',
    method: 'post',
    data: data
  })
}

export function updateEngineerStatus(data) {
  return request({
    url: '/engineer/update-status/',
    method: 'post',
    data: data
  })
}

export function updateEngineer(data) {
  return request({
    url: '/engineer/update/',
    method: 'post',
    data: data
  })
}

export function importEngineerExcel(file) {
  const formData = new FormData() // 创建form对象
  formData.append('file', file)

  return request({
    url: '/engineer/import-file/',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function downloadEngineerExcel(query) {
  return request({
    url: '/engineer/download/',
    method: 'get',
    params: query,
    headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    responseType: 'blob'
  })
}

export function collectionHistory(query) {
  return request({
    url: '/engineer/collection-history/',
    method: 'get',
    params: query
  })
}

export function engineerCollect(data) {
  return request({
    url: '/engineer/collect/',
    method: 'post',
    data: data
  })
}

export function deleteCollection(data) {
  return request({
    url: '/engineer/collection/delete/',
    method: 'post',
    data: data
  })
}

export function auditCollection(data) {
  return request({
    url: '/engineer/collection/audit/',
    method: 'post',
    data: data
  })
}

export function createEngineerBudget(data) {
  return request({
    url: '/engineer/budget/create/',
    method: 'post',
    data: data
  })
}

export function auditEngineerBudget(data) {
  return request({
    url: '/engineer/budget/audit/',
    method: 'post',
    data: data
  })
}

export function deleteEngineerBudget(data) {
  return request({
    url: '/engineer/budget/delete/',
    method: 'post',
    data: data
  })
}

export function updateEngineerBudget(data) {
  return request({
    url: '/engineer/budget/update/',
    method: 'post',
    data: data
  })
}

export function fetchBudgetList(query) {
  return request({
    url: '/engineer/budget/list/',
    method: 'get',
    params: query
  })
}

export function fetchBudgetDetail(query) {
  return request({
    url: '/engineer/budget/detail/',
    method: 'get',
    params: query
  })
}

export function downloadBudgetExcel(query) {
  return request({
    url: '/engineer/budget/export/',
    method: 'get',
    params: query,
    headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    responseType: 'blob'
  })
}


export function fetchCostList(query) {
  return request({
    url: '/engineer/cost/list/',
    method: 'get',
    params: query
  })
}

export function fetchCostDetail(query) {
  return request({
    url: '/engineer/cost/detail/',
    method: 'get',
    params: query
  })
}
