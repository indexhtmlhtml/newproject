import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Problems from '../views/Problems.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/problems/:category',
    name: 'Problems',
    component: Problems
  },
  {
    path: '/create-paper',
    name: 'CreatePaper',
    component: () => import('../views/CreatePaper.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 