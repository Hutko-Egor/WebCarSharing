<template>
  <div class="auth-page">
    <div class="auth-container">
      <router-link to="/" class="back-link">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        На главную
      </router-link>

      <div class="auth-card">
        <div class="auth-header">
          <router-link to="/" class="auth-logo">CAR<span>SHARING</span></router-link>
          <p>Восстановление пароля</p>
        </div>

        <form v-if="!success" class="form-content" @submit.prevent="handleRecovery">
          <div class="auth-note">
            <p>
              <strong>Введите email</strong>, который вы использовали при регистрации.
              Мы отправим вам инструкцию по сбросу пароля.
            </p>
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

          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Отправка...' : 'Отправить инструкцию' }}
          </button>

          <div v-if="errorMessage" class="auth-error">
            {{ errorMessage }}
          </div>
        </form>

        <div v-if="success" class="success-message show">
          <div class="success-icon">&#9993;&#65039;</div>
          <h2>Проверьте почту</h2>
          <p>
            Мы отправили инструкцию по восстановлению пароля на
            <strong>{{ sentEmail }}</strong>
          </p>
          <p style="margin-top: 16px; font-size: 14px;">
            Если письмо не пришло в течение 5 минут, проверьте папку «Спам»
          </p>
        </div>

        <div class="auth-footer">
          <router-link to="/login">Вспомнили пароль? Войти</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const sentEmail = ref('')
const success = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

async function handleRecovery() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    // TODO: вызвать API восстановления пароля когда будет реализован
    // const { useAuth } = '../composables/useApi'
    // await request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email: email.value }) })

    // Имитация задержки отправки
    await new Promise(resolve => setTimeout(resolve, 500))

    sentEmail.value = email.value
    success.value = true
  } catch (error) {
    errorMessage.value = 'Ошибка отправки. Попробуйте ещё раз.'
    console.error('Ошибка восстановления пароля:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Стили перенесены в global style.css */
</style>
