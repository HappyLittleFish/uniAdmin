// import { asyncRouterMap, constantRouterMap } from '@/router'
import { constantRouterMap } from '@/router'
import Layout from '@/views/layout/Layout'
import pendingWithdraw from '@/views/wechatWithdraw/pendingWithdraw'

const asyncRouterMap = [
  {
    path: '/wechatWithdraw',
    component: Layout,
    redirect: '/wechatWithdraw/pendingWithdraw',
    name: 'wechatWithdraw',
    meta: {
      title: '微信提现',
      icon: 'money'
    },
    children: [
      { path: 'pendingWithdraw', component: pendingWithdraw, name: 'pendingWithdraw', meta: { title: '待处理提现' }},
      { path: 'withdrawRecord', component: () => import('@/views//wechatWithdraw/withdrawRecord'), name: 'withdrawRecord', meta: { title: '提现记录' }},
      { path: 'userManage1', component: () => import('@/views/permission/userManage'), name: 'userManage1', meta: { title: '用户管理' }}
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/userManage',
    name: 'permission',
    meta: {
      title: '权限管理',
      icon: 'user'
    },
    children: [
      { path: 'permissionConfig', component: () => import('@/views/permission/permissionConfig'), name: 'permissionConfig', meta: { title: '权限配置' }},
      { path: 'roleManage', component: () => import('@/views/permission/roleManage'), name: 'roleManage', meta: { title: '角色管理' }},
      { path: 'userManage', component: () => import('@/views/permission/userManage'), name: 'userManage', meta: { title: '用户管理' }}
    ]
  }]
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.indexOf(role) >= 0)
//   } else {
//     return true
//   }
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
// function filterAsyncRouter(asyncRouterMap, roles) {
//   const accessedRouters = asyncRouterMap.filter(route => {
//     if (hasPermission(roles, route)) {
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children, roles)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }

function filterAsyncRouter(asyncRouterMap, permissionList) {
  const accessedRouters = asyncRouterMap.filter(route => {
    // console.log('权限列表为', permissionList)
    // console.log('路由列表为', asyncRouterMap)

    let hasPermissionOrNot = false
    for (const item of permissionList) {
      if (item.resourceType === 'menu') {
        if (route.name === item.label) {
          // console.log('具有权限', item.label)
          if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children, permissionList)
            // if (route.children.length) {
            //   hasPermissionOrNot = true
            // }
          }
          hasPermissionOrNot = true
        } else if (route.children && route.children.length) {
          route.children = filterAsyncRouter(route.children, permissionList)
          if (route.children.length) {
            // console.log('子路由满足')
            hasPermissionOrNot = true
          }
        }
      }
    }
    return hasPermissionOrNot
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        // const { roles } = data
        const { permissionList } = data
        let accessedRouters = []
        console.log('过滤前路由', asyncRouterMap)
        accessedRouters = filterAsyncRouter(asyncRouterMap, permissionList)
        console.log('过滤后路由', accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
