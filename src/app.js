import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import EleConfig from './config/element'
// import ElementUI from 'element-ui'
import { sync } from 'vuex-router-sync'

import App from './App.vue'
import * as filters from './filters'
import data from './store'
import router from './router'

import axios from 'axios'
import deepAssign from "deep-assign"
import _ from "lodash"
import "babel-polyfill"

import 'flex.css'
import 'normalize.css'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome.css'
import './style/common.less'


Vue.use(Vuex)
Vue.use(Router)
// Vue.use(ElementUI)

Vue.prototype.$ajax = axios
Vue.prototype.deepAssign = deepAssign

//注册全局过滤器
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

const store = new Vuex.Store(data)

const app = new Vue({
	store,
	router,
	el: '#app',
	render: h => h(App)
})