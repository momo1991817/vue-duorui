// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import VueLazyload from 'vue-lazyload'
// Vue.use(VueLazyload, {
//   // error: 'dist/error.png',//这个是请求失败后显示的图片
//   // loading: 'dist/loading.gif',//这个是加载的loading过渡效果
//   try: 6 // 这个是加载图片数量
// })

// 引入vant ui
import Vant, { Toast } from '../node_modules/vant';
import '../node_modules/vant/lib/index.css';

// 引入rem
import './js/rem'

import './js/common'

import wlwh from "./js/wlwh.js"
Vue.use(wlwh);



// 配置url
let baseURL = ''
let httpUrl = ''
let header = ''
let urlsearch = new UrlSearch()
if (process.env.NODE_ENV === 'development') {
  // 全局默认token
  // Vue.prototype.$token = "4685f33a3c82d04b0ced3d5574fe6611";
  Vue.prototype.$token = "f0ca1b1655006d0ade083088201cde85";
  // baseURL = 'http://192.168.201.185:8088/' // 开发
  baseURL = 'http://120.79.132.229:8083/' // 开发
  httpUrl = 'http://192.168.201.186:8080/'
  header = true
} else if (process.env.NODE_ENV === 'testing') {
  // 全局默认token
  if (!urlsearch.token) {
    Vue.prototype.$token = "f0ca1b1655006d0ade083088201cde85";
  } else {
    Vue.prototype.$token = urlsearch.token;
  }
  baseURL = 'http://120.79.132.229:8083/' // 测试
  httpUrl = 'http://testh5.hnwlcm.com/#/'
  header = false
} else if (process.env.NODE_ENV === 'production') {
  // 全局默认token
  if (!urlsearch.token) {
    Vue.prototype.$token = "f0ca1b1655006d0ade083088201cde85";
  } else {
    Vue.prototype.$token = urlsearch.token;
  }
  baseURL = 'https://h5.hnwlcm.com/api/' // 线上环境
  httpUrl = 'http://h5.hnwlcm.com/#/'
  header = false
}

// 引入上拉加载下拉刷新组件
import VueScroller from 'vue-scroller'
Vue.use(VueScroller)

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)

// 引入axios
import axios from 'axios';
Vue.prototype.$http = axios;
// axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = baseURL;


//请求超时
// axios.defaults.timeout = 10000;

//axios.defaults.baseURL = 'http://192.168.201.184:8081/';
// axios.defaults.baseURL = 'http://120.79.132.229:8083';

// 全局地址
Vue.prototype.$httpUrl = httpUrl;

// 全局调用头部
Vue.prototype.$header = header;

import { Tab, Tabs, Row, Col, PullRefresh, Dialog, NavBar, Tabbar, TabbarItem, Lazyload, Notify, ImagePreview, Divider,Circle  } from 'vant';
import { UrlSearch } from "./js/common";
Vue.use(Vant).use(Toast).use(Tab).use(Tabs).use(Row).use(Col).use(PullRefresh).use(Dialog).use(NavBar).use(Tabbar).use(TabbarItem).use(Notify).use(ImagePreview).use(Divider).use(Circle );
Vue.use(Lazyload, {
  preLoad: 1.3,
  error: '../static/loading/loading-false.jpg',
  loading: '../static/loading/loading-true.jpg',
  attempt: 10
})

Vue.config.productionTip = false

import VueTouch from 'vue-touch'
Vue.use(VueTouch, {name: 'v-touch'})
VueTouch.config.swipe= {
  direction: 'horizontal'
};

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
