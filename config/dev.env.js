'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  // BASE_API: '"https://api-dev"',
    /* 开发线 */
    // BASE_URL: '"http://192.168.1.10:8082/api/"'
    // BASE_URL: '"http://192.168.1.128:8085/api/"'
    BASE_API:'"https://cmst.unifin.com.cn/api/"'
    /* 生产线 */
    // BASE_URL: '"https://cms.unifin.com.cn/api/"'
})
