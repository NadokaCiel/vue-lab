import Router from 'vue-router'

import Home from '../pages/Home.vue'

import Catalog from './catalog'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name:"Home", component: Home }
]
Object.keys(Catalog).forEach(k => {
  Object.keys(Catalog[k]).forEach(p => {
    let route = {}
    if (!Catalog[k][p].sub) {
      route = {
        path: '/' + k.toLowerCase() + '/' + p.toLowerCase(),
        name: k + '-' + p,
        component: Catalog[k][p]
      }
    } else {
      route = {
        path: Catalog[k][p].path,
        name: k + '-' + p,
        component: Catalog[k][p].component
      }
    }

    routes.push(route)
  })
})

routes.push({ path: '*', redirect: '/home' })

let router = new Router({
  // mode: 'history',
  base:'vue-lab',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})
router.beforeEach((to, from, next) => {
  next();
})

export default router
