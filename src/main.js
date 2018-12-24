import Vue from 'vue'
import App from './App'
// 配置路由
import router from './router/index.js'
// 导入element
import ElementUI from 'element-ui'
// 导入element的样式
import 'element-ui/lib/theme-chalk/index.css'
// 导入通用样式
import '@/assets/base.less'
// 导入axios
import axios from 'axios'

Vue.config.productionTip = false
// 安装elementUI插件
Vue.use(ElementUI)

// 给axios设置一个默认全局地址
Vue.prototype.axios = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 给axios配置拦截请求器
axios.interceptors.request.use(
  function(config) {
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)
// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    return response.data
  },
  function(error) {
    return Promise.reject(error)
  }
)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
