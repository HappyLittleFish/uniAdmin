import { login, logout } from '@/api/login'
import { queryPermissionByUserId } from '@/api/permission'
import { getToken, setToken, removeToken, setUserId, getUserId, removeUserId } from '@/utils/auth'
// import $storage from '@/utils/storage'

const user = {
  state: {
    token: getToken(),
    // token: '',
    name: '',
    avatar: '',
    roles: [],
    userName: '',
    userPhoto: '',
    userId: '',
    permissionList: []
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
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    }
  },

  actions: {

    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      // console.log('用户账号密码', userInfo)
      return new Promise((resolve, reject) => {
        login({ userName: username, userPwd: userInfo.password }).then(response => {
          const data = response.data
          // console.log('用户信息', response)
          // commit('SET_TOKEN', data.token)
          setToken(data.token)
          setUserId(data.user.id)
          commit('SET_USER_NAME', data.user.userName)
          commit('SET_USER_ID', data.user.id)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // console.log('用户userId为', getUserId())
        const userId = getUserId()
        queryPermissionByUserId({ userId }).then(response => {
          // console.log('查询到用户的权限列表为', response.data)
          if (!response.data.length) {
            reject('用户没有访问权限')
          }
          commit('SET_PERMISSIONLIST', response.data)
          // console.log('获取存入store的用户权限列表', state.permissionList)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_PERMISSIONLIST', [])
          removeToken()
          removeUserId()
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
        commit('SET_PERMISSIONLIST', [])
        removeToken()
        removeUserId()
        resolve()
      })
    }
  }
}

export default user
