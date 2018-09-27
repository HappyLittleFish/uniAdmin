import Vue from 'vue'
import store from '@/store'

const permission = Vue.directive('permission', {
  bind: function(el, binding) {
    // console.log('el是', el)
    console.log('权限定义', binding.value)
    var hasPermissionOrNot = hasPermission(binding.value, store.getters.permissionList)
    console.log('是否具有按钮权限', hasPermissionOrNot)
    if (!hasPermissionOrNot) {
      el.disabled = true
      el.className = 'filter-item el-button el-button--primary is-disabled'
    }
    console.log('用户权限列表', store.getters.permissionList)
  }
})

function hasPermission(value, arr) {
  var hasPermissionOrNot = false
  for (var item of arr) {
    if (item.resourceType === 'button') {
      console.log('遍历到button类型')
      if (item.permission === value) {
        console.log('具有权限')
        hasPermissionOrNot = true
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
