import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Problems from '../views/Problems.vue'
import SolveProblem from '../views/SolveProblem.vue'
import Interview from '../views/Interview.vue'

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
    path: '/problems/:category/:id/solve',
    name: 'SolveProblem',
    component: SolveProblem
  },
  {
    path: '/create-paper',
    name: 'CreatePaper',
    component: () => import('../views/CreatePaper.vue')
  },
  {
    path: '/interview',
    name: 'Interview',
    component: Interview
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 