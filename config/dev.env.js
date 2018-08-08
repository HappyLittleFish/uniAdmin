'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  // BASE_API: '"https://api-dev"',
    /* 开发线 */
    // BASE_API:'"https://cmst.unifin.com.cn/api/"'
    BASE_API:'"http://localhost:9528/api/"'
    /* 生产线 */
    // BASE_API: '"https://cms.unifin.com.cn/api/"'
})
