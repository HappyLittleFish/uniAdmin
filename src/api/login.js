import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/sys/login',
    method: 'post',
    data: params
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/sys/logout',
    method: 'get'
  })
}
