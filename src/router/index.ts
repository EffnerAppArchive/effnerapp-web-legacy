import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import store from '@/store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/main/home'
  },
  {
    path: '/main/',
    name: 'Main',
    component: () => import('@/views/screens/Main.vue'),
    meta: {
      requiresLogin: true
    },
    children: [
      {
        path: '',
        redirect: '/main/home'
      },
      {
        path: 'home',
        component: () => import('@/views/fragments/Home.vue')
      },
      {
        path: 'exams',
        component: () => import('@/views/fragments/Exams.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/fragments/Tab3.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/screens/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(value => value.meta.requiresLogin)) {
    if(!store.getters.isRegistered) {
      next({name: 'Login'})
      return
    }
  }
  next()
})

export default router
