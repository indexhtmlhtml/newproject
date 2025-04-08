import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Problems from '../views/Problems.vue'
import SolveProblem from '../views/SolveProblem.vue'
import Interview from '../views/Interview.vue'
import ViewPaper from '@/views/ViewPaper.vue'
import Analysis from '../views/Analysis.vue'

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
  },
  {
    path: '/interview',
    name: 'Interview',
    component: Interview
  },
  {
    path: '/interview/chat/:id',
    name: 'InterviewChat',
    component: () => import('../views/InterviewChat.vue'),
    props: true
  },
  {
    path: '/solve-paper',
    name: 'SolvePaper',
    component: () => import('../views/SolvePaper.vue')
  },
  {
    path: '/solve-problem/:id',
    name: 'SolveProblem',
    component: () => import('../views/SolveProblem.vue'),
    props: true,
    beforeEnter: (to, from, next) => {
      if (!to.params.id) {
        next('/problems')
      } else {
        next()
      }
    }
  },
  {
    path: '/paper-result',
    name: 'PaperResult',
    component: () => import('../views/PaperResult.vue')
  },
  {
    path: '/view-paper',
    name: 'ViewPaper',
    component: ViewPaper
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: Analysis,
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router 