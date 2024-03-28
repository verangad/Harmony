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
        requiresAuth: true
      }
    },
    {
      path: '/scoreEditor',
      name: 'scoreEditor',
      component: () => import('../views/ScoreEditor.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

// Check for authentication before each route
// Home and Score Editor require authentication and will route to login if not authenticated
router.beforeEach((to, from, next) => {

  // If route needs authenticating, check for auth
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    let auth = false;

    // Check store for login data
    if(store.userData){
      auth = true;
    }
    else{
      auth= false;
    }

    // Move on if authenticated
    if(auth) {
      next();
    }
    // Move to login if not authenticated
    else {
      next('/login');
    }
  }
  else {
    next();
  }
});

export default router
