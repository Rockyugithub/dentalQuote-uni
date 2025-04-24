import request from '@/utils/request'

export function getUserList(data) {
  return request({
    url: '/users/list',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/users/create',
    method: 'post',
    data
  })
}

export function delUser(data) {
  return request({
    url: '/users/delete',
    method: 'post',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/users/update-password',
    method: 'post',
    data
  })
}

export function loginApi(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}