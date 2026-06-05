import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'ទំព័រដើម' },
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('../views/CoursesView.vue'),
    meta: { title: 'វគ្គសិក្សា' },
  },
  {
    path: '/my-courses',
    name: 'my-courses',
    component: () => import('../views/MyCoursesView.vue'),
    meta: { requiresAuth: true, title: 'វគ្គរបស់ខ្ញុំ' },
  },
  {
    path: '/courses/:id',
    name: 'course-detail',
    component: () => import('../views/CourseDetail.vue'),
    props: true,
    meta: { title: 'ព័ត៌មានវគ្គសិក្សា' },
  },
  {
    path: '/courses/:courseId/lessons/:lessonIndex',
    name: 'lesson',
    component: () => import('../views/LessonView.vue'),
    meta: { requiresAuth: true, title: 'មេរៀន' },
  },
  {
    path: '/practice-lab',
    name: 'practice-lab',
    component: () => import('../views/PracticeLabView.vue'),
    meta: { requiresAuth: true, title: 'Practice Lab' },
  },
  {
    path: '/courses/:courseId/lessons/:lessonIndex/lab',
    name: 'lesson-practice-lab',
    component: () => import('../views/PracticeLabView.vue'),
    meta: { requiresAuth: true, title: 'Practice Lab' },
  },
  {
    path: '/courses/:courseId/quiz',
    name: 'quiz',
    component: () => import('../views/QuizView.vue'),
    meta: { requiresAuth: true, title: 'Quiz' },
  },
  {
    path: '/courses/:courseId/certificate',
    name: 'certificate',
    component: () => import('../views/CertificateView.vue'),
    meta: { requiresAuth: true, title: 'Certificate' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true, title: 'Dashboard' },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminDashboardView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin Dashboard' },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('../views/NotificationsView.vue'),
    meta: { requiresAuth: true, title: 'ការជូនដំណឹង' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true, title: 'ប្រវត្តិរូប' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { requiresAuth: true, title: 'Settings' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'ចូលគណនី' },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/ForgotPasswordView.vue'),
    meta: { title: 'ភ្លេចពាក្យសម្ងាត់' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { title: 'ចុះឈ្មោះ' },
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('../views/LegalView.vue'),
    props: { type: 'privacy' },
    meta: { title: 'Privacy' },
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('../views/LegalView.vue'),
    props: { type: 'terms' },
    meta: { title: 'Terms' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'រកមិនឃើញទំព័រ' },
  },
]

const DEFAULT_TITLE = 'SmartLearn ខ្មែរ | E-Learning Platform'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const { isAdmin, isAuthenticated } = useAuth()

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.requiresAdmin && !isAdmin.value) {
    return {
      path: '/dashboard',
    }
  }

  return true
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | SmartLearn ខ្មែរ` : DEFAULT_TITLE
})

export default router
