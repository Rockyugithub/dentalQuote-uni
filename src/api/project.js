import request from '@/utils/request'

export function getAllProject(data) {
  return request({
    url: '/projects/list',
    method: 'post',
    data
  })
}

export function addProject(data) {
  return request({
    url: '/projects/create',
    method: 'post',
    data
  })
}

export function deleteProject(data) {
    return request({
      url: '/projects/delete',
      method: 'post',
      data
    })
  }

export function addProduct(data) {
    return request({
      url: '/products/add',
      method: 'post',
      data
    })
}

export function deleteProduct(data) {
    return request({
      url: '/products/delete',
      method: 'post',
      data
    })
}

export function updateProduct(data) {
    return request({
      url: '/products/update',
      method: 'post',
      data
    })
}
