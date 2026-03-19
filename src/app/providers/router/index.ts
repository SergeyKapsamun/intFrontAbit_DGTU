import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/widgets/main-layout'
import AbitApplicantsPage from '@/pages/abit'
import VersionPage from '@/pages/version'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/abit',
        },
        {
          path: 'abit',
          name: 'abit',
          component: AbitApplicantsPage,
          meta: { requiresAuth: true },
        },
        {
          path: 'VersionPage',
          name: 'VersionPage',
          component: VersionPage,
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/abit',
    },
  ],
})

export default router
