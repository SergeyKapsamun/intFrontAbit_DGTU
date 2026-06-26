import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '@/widgets/main-layout'
import AbitApplicantsPage from '@/pages/abit'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/abit',
    },
  ],
})

export default router
