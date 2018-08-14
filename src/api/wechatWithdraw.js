import request from '@/utils/request'

export function getWechatWithdrawList(params) {
  return request({
    url: 'management/wallet/queryWalletAuditList',
    method: 'post',
    data: params
  })
}

export function confirmWithdraw(params) {
  return request({
    url: 'management/wallet/confirmAudit',
    method: 'post',
    data: params
  })
}
