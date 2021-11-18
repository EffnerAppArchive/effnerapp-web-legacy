import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import store from '@/store';

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
        name: 'Home',
        path: 'home',
        component: () => import('@/views/fragments/Home.vue')
      },
      {
        name: 'Schulaufgaben',
        path: 'exams',
        component: () => import('@/views/fragments/Exams.vue')
      },
      {
        name: 'Vertretungen',
        path: 'substitutions',
        component: () => import('@/views/fragments/Substitutions.vue')
      },
      {
        name: 'MVV',
        path: 'mvv',
        component: () => import('@/views/fragments/MVV.vue')
      },
      {
        name: 'Settings',
        path: 'settings',
        component: () => import('@/views/fragments/Settings.vue')
      },
      {
        name: 'Stundenplan',
        path: 'timetable',
        component: () => import('@/views/fragments/Timetable.vue')
      },
      {
        name: 'Informationen',
        path: 'information',
        component: () => import('@/views/fragments/Information.vue')
      },
      {
        name: 'Aktuelles',
        path: 'news',
        component: () => import('@/views/fragments/News.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/screens/Login.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(value => value.meta.requiresLogin)) {
    if(!store.getters.isRegistered) {
      router.push({name: 'Login'});
    }
  }
  return next();
});

export default router;
