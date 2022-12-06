/* eslint-disable no-unused-vars */
import Vue from 'vue'
import App from './App.vue' 
import {i18n} from './locales/i18n'
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

import "./assets/css/index.css"
import "./assets/css/mZQSaveUI.css"
import "./assets/css/font_ico/iconfont.css"
import "./assets/css/element.css"
import "./assets/css/config.css"
import "./assets/css/addStyle.css"	
import "./assets/css/login.css"
import "./assets/css/bst.css"
import "./assets/css/mArticlesDlg.css"

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
