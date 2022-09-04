import request from '@/utils/request'

export function fetchCategories(query) {
  return request({
    url: '/material/category/list/',
    method: 'get',
    params: query
  })
}

export function createCategory(data) {
  return request({
    url: '/material/category/create/',
    method: 'post',
    data: data
  })
}

export function updateCategory(data) {
  return request({
    url: '/material/category/update/',
    method: 'post',
    data: data
  })
}

export function deleteCategory(data) {
  return request({
    url: '/material/category/delete/',
    method: 'post',
    data: data
  })
}

export function fetchList(query) {
  return request({
    url: '/material/list/',
    method: 'get',
    params: query
  })
}

export function createMaterial(data) {
  return request({
    url: '/material/create/',
    method: 'post',
    data: data
  })
}

export function updateMaterial(data) {
  return request({
    url: '/material/update/',
    method: 'post',
    data: data
  })
}

export function deleteMaterial(data) {
  return request({
    url: '/material/delete/',
    method: 'post',
    data: data
  })
}

export function importCategoryExcel(file) {
  const formData = new FormData() // 创建form对象
  formData.append('file', file)

  return request({
    url: '/material/category/import-file/',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
