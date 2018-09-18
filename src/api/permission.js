import request from '@/utils/request'

export function getPermissionList(params) {
  return request({
    url: '/permission/permissionList',
    method: 'post',
    data: params
  })
}

export function permissionAdd(params) {
  return request({
    url: '/permission/permissionAdd',
    method: 'post',
    data: params
  })
}

export function permissionUpdate(params) {
  return request({
    url: '/permission/permissionUpdate',
    method: 'post',
    data: params
  })
}

export function permissionDel(params) {
  return request({
    url: '/permission/permissionDel',
    method: 'post',
    data: params
  })
}

export function queryPermissionByUserId(params) {
  return request({
    url: '/permission/queryByUserId',
    method: 'post',
    data: params
  })
}
