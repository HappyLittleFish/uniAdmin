import { asyncRouterMap, constantRouterMap } from '@/router'

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
