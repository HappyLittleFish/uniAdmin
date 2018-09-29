import { asyncRouterMap, constantRouterMap } from '@/router'
// import { deepClone } from '@/utils'

function filterAsyncRouter(routerMap, permissionList) {
  // console.log('接手到的路由表为', routerMap)
  const accessedRouters = routerMap.filter(route => {
    // console.log('权限列表为', permissionList)
    // console.log('路由列表为', asyncRouterMap)
    let hasPermissionOrNot = false
    for (const item of permissionList) {
      if (item.resourceType === 'menu') {
        if (route.name === item.label) {
          // console.log('具有权限', item.label)
          if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children, item.children)
            if (route.children.length) {
              console.log('父路由满足子路由满足', route.children)
              hasPermissionOrNot = true
              return true
            }
          } else {
            console.log('没有子路由父路由满足', route)
            hasPermissionOrNot = true
            return true
          }
        }
      }
    }
    // return false
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
        const permissionList = data
        let accessedRouters = []
        // console.log('过滤前路由', asyncRouterMap)
        // var routerMap = deepClone(asyncRouterMap)
        // console.log('过滤前路由', routerMap)
        accessedRouters = filterAsyncRouter(asyncRouterMap, permissionList)
        // accessedRouters = filterAsyncRouter(asyncRouterMap, [])
        console.log('过滤后路由', accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
