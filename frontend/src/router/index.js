import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ForgotPasswordPage from '../views/ForgotPasswordPage.vue'
import CatalogPage from '../views/CatalogPage.vue'
import FavoritesPage from '../views/FavoritesPage.vue'
import AccountPage from '../views/AccountPage.vue'
import AdminPage from '../views/AdminPage.vue'
import FaqPage from '../views/FaqPage.vue'
import NotFoundPage from '../views/NotFoundPage.vue'
import CarDetailPage from '../views/CarDetailPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage, meta: { guestOnly: true } },
  { path: '/register', name: 'Register', component: RegisterPage, meta: { guestOnly: true } },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPasswordPage, meta: { guestOnly: true } },
  { path: '/catalog', name: 'Catalog', component: CatalogPage },
  { path: '/car/:id', name: 'CarDetail', component: CarDetailPage, props: true },
  { path: '/favorites', name: 'Favorites', component: FavoritesPage, meta: { requiresAuth: true } },
  { path: '/account', name: 'Account', component: AccountPage, meta: { requiresAuth: true } },
  { path: '/admin', name: 'Admin', component: AdminPage, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/faq', name: 'Faq', component: FaqPage },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (to.meta.guestOnly && token) return next({ name: 'Home' })
  if (to.meta.requiresAuth && !token) return next({ name: 'Login', query: { redirect: to.fullPath } })
  if (to.meta.requiresAdmin && user?.role !== 'admin') return next({ name: 'Home' })
  
  next()
})

export default router;