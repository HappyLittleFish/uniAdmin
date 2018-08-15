import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 30000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  },
  withCredentials: false
})

// 添加响应状态
const responseStatus = {
  ok: 0, // 成功
  fail: 1, // 出现异常或者输入信息不合法
  sessiontimeout: 9401 // 未登录或者登陆信息过期
}

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers.token = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
  const resCode = resData.status.code
  const resMsg = resData.status.msg
  const resData = response.data
  if (resCode === responseStatus.fail) {
    Message({
      message: resMsg,
      type: 'error',
      duration: 5 * 1000
    })

    // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //   MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
    //     confirmButtonText: '重新登录',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     store.dispatch('FedLogOut').then(() => {
    //       location.reload()// 为了重新实例化vue-router对象 避免bug
    //     })
    //   })
    // }
    return Promise.reject('error')
  } else if (resCode === responseStatus.sessiontimeout) {
    MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      store.dispatch('FedLogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
    })
    return Promise.reject('error')
  } else if (resCode === responseStatus.ok) {
    return resData
  }
},
error => {
  console.log('err' + error)// for debug
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
}
)

export default service
