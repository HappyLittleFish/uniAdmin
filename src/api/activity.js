import request from '@/utils/request'

export function getActivityList(config) {
  return request({
    url: 'management/activity/queryActivityList',
    method: 'post',
    data: config
  })
}

export function addActivity(config) {
  return request({
    url: 'management/activity/insertActivity',
    method: 'post',
    data: config
  })
}

export function updateActivity(config) {
  return request({
    url: 'management/activity/updateActivity',
    method: 'post',
    data: config
  })
}

export function deleteActivity(config) {
  return request({
    url: 'management/activity/removeActivity',
    method: 'post',
    data: config
  })
}

