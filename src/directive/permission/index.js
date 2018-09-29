import Vue from 'vue'
import store from '@/store'

const permission = Vue.directive('permission', {
  bind: function(el, binding) {
    const hasButtonPermission = hasPermission(binding.value, store.getters.permissionList)
    if (!hasButtonPermission) {
      el.disabled = true
      el.className = 'filter-item el-button el-button--primary is-disabled'
    }
  }
})

function hasPermission(value, arr) {
  let hasPermissionOrNot = false
  for (const item of arr) {
    if (item.resourceType === 'button') {
      // console.log('遍历到button类型')
      if (value === item.permission) {
        return true
      }
    } else if (item.children && item.children.length) {
      hasPermissionOrNot = hasPermission(value, item.children)
      if (hasPermissionOrNot) {
        return hasPermissionOrNot
      }
    }
  }
  return hasPermissionOrNot
}
export default permission
