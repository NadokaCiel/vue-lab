import Router from 'vue-router'

import Home from '../pages/Home.vue'

import * as Test from '../pages/Test/bundle'
import * as Article from '../pages/Article/bundle'

let router = new Router({
  // mode: 'history',
  base:'vue-lab',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', name:"Home", component: Home },
    { path: '/lab/button', name:"Button", component: Test.Button },
    { path: '/lab/linkup', name:"Linkup", component: Test.Linkup },
    { path: '/lab/chess', name:"Chess", component: Test.Chess },
    { path: '/lab/traversal', name:"Traversal", component: Test.Traversal },
    { path: '/article/list', name:"ArticleList", component: Article.List },
    { path: '*', redirect: '/home' },
  ]
})
router.beforeEach((to, from, next) => {
  next();
})

export default router
