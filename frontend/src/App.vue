<template>
  <div id="app">
    <header>
      <div class="container">
        <nav>
          <router-link to="/" class="logo">CAR<span>SHARING</span></router-link>

          <ul class="nav-links">
            <li><router-link to="/">Главная</router-link></li>
            <li><router-link to="/catalog">Автомобили</router-link></li>
            <li><router-link to="/tariffs">Тарифы</router-link></li>
            <li><router-link to="/faq">FAQ</router-link></li>
          </ul>

          <!-- Не авторизован -->
          <div v-if="!isAuthenticated" style="display: flex; align-items: center; gap: 24px;">
            <router-link to="/register">Регистрация</router-link>
            <router-link to="/login" class="btn btn-primary">Войти</router-link>
          </div>

          <!-- Авторизован -->
          <div v-else style="display: flex; align-items: center; gap: 24px;">
            <router-link v-if="!isAdmin" to="/favorites" class="nav-icon" title="Избранное">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </router-link>
            <router-link v-if="!isAdmin" to="/account" class="btn btn-primary">{{ user?.name }}</router-link>
            <router-link v-if="isAdmin" to="/admin" class="btn btn-primary">⚡ Админ</router-link>
            <button @click="handleLogout" class="btn btn-outline" style="padding: 8px 16px; cursor: pointer;">Выйти</button>
          </div>
        </nav>
      </div>
    </header>

    <router-view />

    <footer>
      <div class="container">
        <div class="footer-content">
          <div class="footer-col">
            <h4>Компания</h4>
            <ul>
              <li><a href="#">О нас</a></li>
              <li><a href="#">Карьера</a></li>
              <li><a href="#">Пресс-центр</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Поддержка</h4>
            <ul>
              <li><a href="#">Помощь</a></li>
              <li><a href="#">Контакты</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Правовая информация</h4>
            <ul>
              <li><a href="#">Условия использования</a></li>
              <li><a href="#">Конфиденциальность</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Соцсети</h4>
            <ul>
              <li><a href="#">Telegram</a></li>
              <li><a href="#">VK</a></li>
            </ul>
          </div>
        </div>
        <div class="copyright">
          © 2026 CarSharing. Все права защищены.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from './composables/useAuthStore'
import { useAuth } from './composables/useApi'

const { user, isAuthenticated, isAdmin, clearAuth } = useAuthStore()
const { logout } = useAuth()

async function handleLogout() {
  try {
    await logout()
  } catch (e) {
    console.error('Ошибка при выходе:', e)
  }
  clearAuth()
  window.location.href = '/'
}
</script>
