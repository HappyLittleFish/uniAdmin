function isObject(value) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

function isFunction(fn) {
  return Object.prototype.toString.call(fn) === '[object Function]'
}

const Storage = function(storage) {
  this.storage = storage
}

Storage.prototype = {
  constructor: Storage,
  setItem(name, data) {
    const valuetype = Object.prototype.toString.call(data)
    if (isObject(data) && !isFunction(data)) {
      data = JSON.stringify(data)
    }
    this.storage.setItem('_' + name + '_type', valuetype)
    this.storage.setItem(name, data)
  },
  getItem(name) {
    let value, valuetype
    if (this.has(name)) {
      value = this.storage.getItem(name)
      valuetype = this.storage.getItem('_' + name + '_type')
      // console.log('value', value, typeof value)
      // console.log('valuetype', valuetype)
      if (valuetype === '[object Object]' || valuetype === '[object Array]') {
        value = JSON.parse(value)
      }
    }
    return value
  },
  has(name) {
    return this.storage.hasOwnProperty(name)
  },
  removeItem(name) {
    if (this.has(name)) {
      this.storage.removeItem(name)
      this.storage.removeItem('_' + name + '_type')
    }
  }
}

const $Storage = {
  sessionStorage: new Storage(window.sessionStorage),
  localStorage: new Storage(window.localStorage)
}

export default $Storage
