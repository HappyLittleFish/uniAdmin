import axios from 'axios'
import store from '../store'
import ElementUI from 'element-ui'
import router from '../router/index'

const $axios = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  },
  withCredentials: false
})
const responseStatus = {
  ok: 0, // 成功
  fail: 1, // 出现异常或者输入信息不合法
  sessiontimeout: 9401 // 未登录或者登陆信息过期
}

// 添加请求拦截器
$axios.interceptors.request.use(config => {
  // store.dispatch('toggleShowLoading', true)
  // ElementUI.service({ fullscreen: true })// 页面加载进行
  // 把token添加到请求头
  // console.log(store.getters.token)
  config.headers.token = store.getters.token
  // console.log('axios Config', config)
  return config
}, error => {
  // 对请求错误做些什么
  console.log(error)
  return Promise.reject(error)
})

// 添加响应拦截器
$axios.interceptors.response.use(response => {
  console.log('请求响应', response.config.url)
  // ElementUI.service({ fullscreen: false })
  // store.dispatch('toggleShowLoading', false)
  const resData = response.data
  const resCode = resData.status.code
  const resMsg = resData.status.msg
  console.log(resData, resCode, resMsg)
  if (resCode === responseStatus.ok) {
    // iview.Message.success(resMsg)
    return resData
  } else if (resCode === responseStatus.fail) {
    ElementUI.Message.error(resMsg)
    // store.dispatch('toggleErrorMsg', resMsg)
    return null
  } else if (resCode === responseStatus.sessiontimeout) { // 验证码失效
    // store.dispatch('toggleErrorMsg', resMsg)
    /* 跳转到登录页 */
    ElementUI.Message.error('登录信息已过期')
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 2000)
    return null
  } else {
    // store.dispatch('toggleErrorMsg', resMsg)
    return null
  }
}, error => {
  // 对请求错误做些什么
  // iview.LoadingBar.finish()
  ElementUI.Message.error('服务器响应失败')
  return Promise.reject(error)
})

export default $axios
