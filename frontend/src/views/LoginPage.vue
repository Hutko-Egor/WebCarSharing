<template>
  <div class="auth-page">
    <div class="auth-container">
      <router-link to="/" class="back-link">
        &#8592; На главную
      </router-link>

      <div class="auth-card">
        <div class="auth-header">
          <router-link to="/" class="auth-logo">CAR<span>SHARING</span></router-link>
          <p>Войдите в свой аккаунт</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="name@example.com"
              required
              autocomplete="email"
            >
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
              required
              autocomplete="current-password"
            >
          </div>

          <div class="forgot-password">
            <router-link to="/forgot-password">Забыли пароль?</router-link>
          </div>

          <button type="submit" class="btn btn-primary auth-btn" :disabled="isLoading">
            {{ isLoading ? 'Вход...' : 'Войти' }}
          </button>

          <div v-if="errorMessage" class="auth-error">
            {{ errorMessage }}
          </div>
        </form>

        <div class="auth-divider">
          <span>или войти через</span>
        </div>

        <div class="auth-footer">
          Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useApi'
import { useAuthStore } from '../composables/useAuthStore'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()
const { setAuth } = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const result = await login(email.value.trim(), password.value)

    if (result.success && result.token && result.user) {
      setAuth(result.token, result.user)

      if (result.user.role === 'admin') {
        router.push('/admin')
      } else {
        const redirectPath = route.query.redirect || '/account'
        router.push(redirectPath)
      }
    } else {
      errorMessage.value = result.message || 'Ошибка входа. Проверьте email и пароль.'
    }
  } catch (error) {
    errorMessage.value = 'Ошибка подключения к серверу'
    console.error('Ошибка входа:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Стили перенесены в global style.css */
</style>
