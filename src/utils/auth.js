import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserKey = 'User-ID'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setUserId(userId) {
  return Cookies.set(UserKey, userId)
}

export function getUserId() {
  return Cookies.get(UserKey)
}

export function removeUserId() {
  return Cookies.remove(UserKey)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
