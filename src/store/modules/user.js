import { login, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import $storage from '@/utils/storage'

const user = {
  state: {
    token: getToken(),
    // token: '',
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_NAME(state, name) {
      state.userName = name
    },
    SET_USER_PHOTO(state, src) {
      state.userPhoto = src
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {

    // 旧版逻辑
    // setUserName({ commit }, name) {
    //   commit('SET_USER_NAME', name)
    //   $storage.sessionStorage.setItem('userName', name)
    // },
    // setUserPhoto({ commit }, src) {
    //   commit('SET_USER_PHOTO', src)
    //   $storage.sessionStorage.setItem('userPhoto', src)
    // },
    // setToken({ commit }, token) {
    //   commit('SET_TOKEN', token)
    //   $storage.sessionStorage.setItem('token', token)
    // },

    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          console.log('用户信息', data)
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          commit('SET_USER_NAME', data.user.userName)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // getInfo(state.token).then(response => {
        const data = { roles: ['admin', 'all', 'editor'] }
        if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', data.roles)
        } else {
          reject('getInfo: roles must be a non-null array !')
        }
        // commit('SET_NAME', data.name)
        // commit('SET_AVATAR', data.avatar)
        resolve(data)
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
