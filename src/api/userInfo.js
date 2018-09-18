import request from '@/utils/request'
// 查询运营所有用户
export function getUserInfo(params) {
  return request({
    url: '/userInfo/userList',
    method: 'post',
    data: params
  })
}
// 添加运营用户
export function addUserInfo(params) {
  return request({
    url: '/userInfo/userAdd',
    method: 'post',
    data: params
  })
}
// 删除运营用户
export function delUserInfo(params) {
  return request({
    url: '/userInfo/userDel',
    method: 'post',
    data: params
  })
}

