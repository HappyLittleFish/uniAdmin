import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

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
  for (const item of permissionList) {
    var hasParams = /^\/(.*)\//
    let pathName = ''
    if (hasParams.test(item.url)) {
      pathName = '/' + item.url.match(hasParams)[1]
    } else {
      pathName = item.url
    }
  }
  const accessedRouters = asyncRouterMap.filter(route => {

    for (const item of permissionList) {
      if (item.resource_type === 'menu') {
        var hasParams = /^\/(.*)\//
        let pathName = ''
        let pathChildren = ''
        if (hasParams.test(item.url)) {
          pathName = '/' + item.url.match(hasParams)[1]
          pathChildren = '/' + item.url.match(hasParams)[2]
        } else {
          pathName = item.url
          pathChildren = item.url
        }
        if (route.path === pathName)
      }
    }
    // if (hasPermission(roles, route)) {
    //   if (route.children && route.children.length) {
    //     route.children = filterAsyncRouter(route.children, roles)
    //   }
    //   return true
    // }

    return false
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
        // if (roles.indexOf('admin') >= 0) {
        //   accessedRouters = asyncRouterMap
        // } else {
        //   accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        // }
        accessedRouters = filterAsyncRouter(asyncRouterMap, permissionList)
        console.log(accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
