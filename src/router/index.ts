import { createRouter, createWebHashHistory, RouteRecordRaw, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/components',
    name: 'Components',
    component: () => import(/* webpackChunkName: "unhome" */ '../views/Components.vue')
  },
  {
    path: '/cssanim',
    name: 'CssAnimation',
    component: () => import(/* webpackChunkName: "unhome" */ '../views/CssAnimation.vue')
  }
]

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes
})

export default router
