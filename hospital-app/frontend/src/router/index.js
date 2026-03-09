import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import PatientView from '../views/PatientView.vue'
import AboutView from '../views/AboutView.vue'
import DoctorDetailView from '../views/DoctorDetailView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/patients',
    component: PatientView,
    meta: { requiresAuth: true, roles: ['admin', 'receptionist'] }
  },
  {
    path: '/patients/:id',
    component: () => import('../views/PatientDetailView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'receptionist', 'doctor'] }
  },
  {
    path: '/appointments',
    component: () => import('../views/AppointmentView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'receptionist', 'doctor'] }
  },
  {
    path: '/appointments/:id',
    component: () => import('../views/AppointmentDetailView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'receptionist', 'doctor'] }
  },
  {
    path: '/rooms',
    component: () => import('../views/RoomView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'receptionist', 'doctor'] }
  },
  {
    path: '/rooms/:id',
    component: () => import('../views/RoomDetailView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'receptionist', 'doctor'] }
  },
  {
    path: '/doctors',
    component: () => import('../views/DoctorView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/doctors/:id',
    component: () => import('../views/DoctorDetailView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/users/:id',
    component: () => import('../views/UserDetailView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/users/:id/edit',
    component: () => import('../views/UserEditView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/accounts',
    component: () => import('../views/AccountView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/collaborators',
    component: () => import('../views/CollaboratorView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/trash',
    component: () => import('../views/TrashView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/my-appointments',
    component: () => import('../views/DoctorAppointmentView.vue'),
    meta: { requiresAuth: true, roles: ['doctor'] }
  },
  {
    path: '/my-patients',
    component: () => import('../views/DoctorPatientView.vue'),
    meta: { requiresAuth: true, roles: ['doctor'] }
  },
  {
    path: '/about',
    component: AboutView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.initializeFromStorage()

  const requiresAuth = to.meta.requiresAuth !== false
  const allowedRoles = to.meta.roles

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (requiresAuth && allowedRoles && !allowedRoles.includes(authStore.user?.role)) {
    next('/login')
  } else if (!requiresAuth && authStore.isAuthenticated && to.path === '/login') {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
