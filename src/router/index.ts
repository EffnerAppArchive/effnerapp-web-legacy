import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/fragments/Tabs.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/fragments/Tab1.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/fragments/Tab2.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/fragments/Tab3.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/screens/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
