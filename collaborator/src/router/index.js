import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Login.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/Create.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/canvas',
      name: 'canvas',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Canvas.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/voice',
      name: 'voice',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Voice.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    let isAuthenticated= false;
    if(localStorage.getItem('userToken'))
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
