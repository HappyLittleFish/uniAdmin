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

export function getRoleList(params) {
  return request({
    url: '/role/roleList',
    method: 'post',
    data: params
  })
}

export function addRole(params) {
  return request({
    url: '/role/roleAdd',
    method: 'post',
    data: params
  })
}

export function delRole(params) {
  return request({
    url: '/role/roleDelete',
    method: 'post',
    data: params
  })
}

export function updateRole(params) {
  return request({
    url: '/role/roleUpdate',
    method: 'post',
    data: params
  })
}

export function resetPassword(params) {
  return request({
    url: '/userInfo/reset-password',
    method: 'post',
    data: params
  })
}

export function getUserList(params) {
  return request({
    url: '/userInfo/userList',
    method: 'post',
    data: params
  })
}

export function getUserListByRoleId(params) {
  return request({
    url: '/userInfo/userListByRoleId',
    method: 'post',
    data: params
  })
}

export function addUser(params) {
  return request({
    url: '/userInfo/userAdd',
    method: 'post',
    data: params
  })
}

export function delUser(params) {
  return request({
    url: '/userInfo/userDel',
    method: 'post',
    data: params
  })
}

export function updateUser(params) {
  return request({
    url: '/userInfo/userUpdate',
    method: 'post',
    data: params
  })
}

