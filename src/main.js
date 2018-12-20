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

Vue.config.productionTip = false
// 安装elementUI插件
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
