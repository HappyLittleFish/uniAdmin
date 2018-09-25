import request from '@/utils/request'

export function getWechatMenuList(params) {
  return request({
    url: 'wechat/menu/wechatMenuList',
    method: 'post',
    data: params
  })
}

export function addWechatMenuList(params) {
  return request({
    url: 'wechat/menu/wechatMenuAdd',
    method: 'post',
    data: params
  })
}

export function updateWechatMenuList(params) {
  return request({
    url: '/wechat/menu/wechatMenuUpdate',
    method: 'post',
    data: params
  })
}

export function delWechatMenuList(params) {
  return request({
    url: 'wechat/menu/wechatMenuDel',
    method: 'post',
    data: params
  })
}

export function initMenu(params) {
  return request({
    url: 'wechat/menu/initMenu',
    method: 'post',
    data: params
  })
}
