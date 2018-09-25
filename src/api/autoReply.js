import request from '@/utils/request'

export function wechatMsgReplyList(params) {
  return request({
    url: 'wechat/msg/reply/wechatMsgReplyList',
    method: 'post',
    data: params
  })
}

export function wechatMsgReplyDel(params) {
  return request({
    url: 'wechat/msg/reply/wechatMsgReplyDel',
    method: 'post',
    data: params
  })
}

export function wechatMsgReplyAdd(params) {
  return request({
    url: 'wechat/msg/reply/wechatMsgReplyAdd',
    method: 'post',
    data: params
  })
}

export function wechatMsgReplyUpdate(params) {
  return request({
    url: 'wechat/msg/reply/wechatMsgReplyUpdate',
    method: 'post',
    data: params
  })
}
