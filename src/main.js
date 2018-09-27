import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css
import './assets/style/common.css'

// import axios from './api/api'
import axios from './utils/request'
import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
import './mock' // simulation data

import '@/icons' // icon
import '@/permission' // permission control

import * as filters from './filters' // global filters

import permission from '@/directive/permission/index.js'

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(ElementUI, { locale })
Vue.use(permission)

Vue.config.productionTip = false
Object.defineProperty(Vue.prototype, '$axios', { value: axios })
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
