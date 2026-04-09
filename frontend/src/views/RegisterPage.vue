<template>
  <div class="auth-page">
    <div class="auth-container">
      <router-link to="/" class="back-link">
        &#8592; На главную
      </router-link>

      <div class="auth-card">
        <div class="auth-header">
          <router-link to="/" class="auth-logo">CAR<span>SHARING</span></router-link>
          <p>Создайте аккаунт</p>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Имя</label>
              <input
                type="text"
                id="firstName"
                v-model="firstName"
                placeholder="Иван"
                required
              >
            </div>

            <div class="form-group">
              <label for="lastName">Фамилия</label>
              <input
                type="text"
                id="lastName"
                v-model="lastName"
                placeholder="Петров"
                required
              >
            </div>
          </div>

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
            <label for="phone">Телефон</label>
            <input
              type="tel"
              id="phone"
              v-model="phone"
              placeholder="+7 (999) 000-00-00"
              required
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
              autocomplete="new-password"
              @input="updatePasswordRequirements"
            >
          </div>

          <div class="password-requirements">
            <h4>Требования к паролю:</h4>
            <ul>
              <li :style="{ color: passwordChecks.length ? '#00DC82' : '#888888' }">Минимум 8 символов</li>
              <li :style="{ color: passwordChecks.uppercase ? '#00DC82' : '#888888' }">Хотя бы одна заглавная буква</li>
              <li :style="{ color: passwordChecks.digit ? '#00DC82' : '#888888' }">Хотя бы одна цифра</li>
            </ul>
          </div>

          <button type="submit" class="btn btn-primary auth-btn" :disabled="isLoading">
            {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>

          <div v-if="errorMessage" class="auth-error">
            {{ errorMessage }}
          </div>
        </form>

        <div class="auth-footer">
          Уже есть аккаунт? <router-link to="/login">Войти</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useApi'
import { useAuthStore } from '../composables/useAuthStore'

const router = useRouter()
const { register } = useAuth()
const { setAuth } = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const passwordChecks = reactive({
  length: false,
  uppercase: false,
  digit: false
})

function validatePassword(pwd) {
  const errors = []
  if (pwd.length < 8) errors.push('Минимум 8 символов')
  if (!/[A-ZА-ЯЁ]/.test(pwd)) errors.push('Хотя бы одна заглавная буква')
  if (!/[0-9]/.test(pwd)) errors.push('Хотя бы одна цифра')
  return errors
}

function updatePasswordRequirements() {
  const pwd = password.value
  passwordChecks.length = pwd.length >= 8
  passwordChecks.uppercase = /[A-ZА-ЯЁ]/.test(pwd)
  passwordChecks.digit = /[0-9]/.test(pwd)
}

async function handleRegister() {
  errorMessage.value = ''

  const passwordErrors = validatePassword(password.value)
  if (passwordErrors.length > 0) {
    errorMessage.value = 'Пароль не соответствует требованиям: ' + passwordErrors.join(', ')
    return
  }

  isLoading.value = true

  try {
    const userData = {
      name: `${firstName.value.trim()} ${lastName.value.trim()}`,
      email: email.value.trim(),
      phone: phone.value.trim(),
      password: password.value
    }

    const result = await register(userData)

    if (result.success && result.token && result.user) {
      setAuth(result.token, result.user)
      router.push('/')
    } else {
      if (result.errors) {
        errorMessage.value = result.errors.map(e => e.message).join(', ')
      } else {
        errorMessage.value = result.message || 'Ошибка регистрации'
      }
    }
  } catch (error) {
    errorMessage.value = 'Ошибка подключения к серверу'
    console.error('Ошибка регистрации:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Стили перенесены в global style.css */
</style>
