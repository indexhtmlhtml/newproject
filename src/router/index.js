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
  },
  {
    path: '/solve-paper',
    name: 'SolvePaper',
    component: () => import('../views/SolvePaper.vue')
  },
  {
    path: '/solve-problem',
    name: 'SolveProblem',
    component: () => import('../views/SolveProblem.vue')
  },
  {
    path: '/paper-result',
    name: 'PaperResult',
    component: () => import('../views/PaperResult.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router 