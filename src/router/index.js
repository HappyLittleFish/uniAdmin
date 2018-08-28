import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    meta: {
      title: '统计'
    },
    children: [{
      meta: {
        title: '首页'
      },
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  }
]

export default new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/userList',
    name: 'permission',
    meta: {
      title: '权限管理',
      icon: 'user'
    },
    children: [
      { path: 'userList', component: () => import('@/views/permission/userList'), name: 'userList', meta: { title: '角色列表' }},
      { path: 'userManager', component: () => import('@/views/permission/userManager'), name: 'userManager', meta: { title: '角色管理' }}
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/activityManage',
    name: 'activity',
    meta: {
      title: '运营活动',
      icon: 'table'
    },
    children: [
      { path: 'activityManage', component: () => import('@/views/activity/activityManage'), name: 'activityManage', meta: { title: '活动管理' }},
      { path: 'awardManage', component: () => import('@/views/activity/awardManage'), name: 'awardManage', meta: { title: '奖品管理' }}
    ]
  },
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
      { path: 'pendingWithdraw', component: () => import('@/views/wechatWithdraw/pendingWithdraw'), name: 'pendingWithdraw', meta: { title: '待处理提现' }},
      { path: 'withdrawRecord', component: () => import('@/views/wechatWithdraw/withdrawRecord'), name: 'withdrawRecord', meta: { title: '提现记录' }}
    ]
  },
  {
    path: '/vedioManage',
    component: Layout,
    redirect: '/vedioManage/vedioSeries',
    name: 'vedioManage',
    meta: {
      title: '视频管理',
      icon: 'table'
    },
    children: [
      { path: 'vedioSeries', component: () => import('@/views/vedioManage/vedioSeries'), name: 'vedioSeries', meta: { title: '视频系列列表' }},
      { path: 'seriesDetil/:id', component: () => import('@/views/vedioManage/seriesDetil'), name: 'seriesDetil', meta: { title: '系列详情' }, hidden: true },
      { path: 'vedioList/:id', component: () => import('@/views/vedioManage/vedioList'), name: 'vedioList', meta: { title: '视频列表' }, hidden: true },
      { path: 'vedioDetil/:vid', component: () => import('@/views/vedioManage/vedioDetil'), name: 'vedioDetil', meta: { title: '视频列表' }, hidden: true }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
