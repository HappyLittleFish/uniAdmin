import request from '@/utils/request'

export function getActivityList(params) {
  return request({
    url: 'management/activity/queryActivityList',
    method: 'post',
    data: params
  })
}

export function addActivity(params) {
  return request({
    url: 'management/activity/insertActivity',
    method: 'post',
    data: params
  })
}

export function updateActivity(params) {
  return request({
    url: 'management/activity/updateActivity',
    method: 'post',
    data: params
  })
}

export function deleteActivity(params) {
  return request({
    url: 'management/activity/removeActivity',
    method: 'post',
    data: params
  })
}

