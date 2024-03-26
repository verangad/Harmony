import { createRouter, createWebHistory } from 'vue-router'
import { store } from '../store.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/home',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Home.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/scoreeditor',
      name: 'scoreeditor',
      component: () => import('../views/ScoreEditor.vue'),
      meta: {
        requiresAuth: false
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    let isAuthenticated= false;
    if(store.userData)
      isAuthenticated = true;
    else
      isAuthenticated= false;
    if(isAuthenticated) {
      next(); // allow to enter route
    } else{
      next('/login'); // go to '/login';
    }
  } else {
    next();
  }
});


export default router
