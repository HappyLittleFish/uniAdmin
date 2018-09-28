import Vue from 'vue'
import store from '@/store'

const permission = Vue.directive('permission', {
  bind: function(el, binding) {
    console.log('按钮权限列表为', store.getters.permissionList)
    const hasButtonPermission = hasPermission(binding.value, store.getters.permissionList)
    console.log('是否具有按钮权限', hasButtonPermission)
    if (!hasButtonPermission) {
      el.disabled = true
      el.className = 'filter-item el-button el-button--primary is-disabled'
    } else {
      el.disabled = false
    }
  }
})

function hasPermission(value, arr) {
  var hasPermissionOrNot = false
  for (const item of arr) {
    if (item.resourceType === 'button') {
      // console.log('遍历到button类型')
      // 如果value值 存在于权限列表中
      if (value === item.permission) {
        console.log('两者的值为', item.permission, value)
        console.log('用户拥有按钮权限')
        // hasPermissionOrNot = true
        return true
      } else if (item.children && item.children.length) {
        hasPermissionOrNot = hasPermission(value, item.children)
      }
    } else if (item.children && item.children.length) {
      hasPermissionOrNot = hasPermission(value, item.children)
    }
  }
  return hasPermissionOrNot
}
export default permission
