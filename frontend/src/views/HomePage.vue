<template>
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h1>Движение <span>без правил</span></h1>
          <p>Экологичный каршеринг для современного города. Электро и гибриды в один клик.</p>
          <div class="hero-buttons">
            <router-link to="/login" class="btn btn-primary">Начать поездку</router-link>
            <button class="btn btn-outline">Узнать больше</button>
          </div>
        </div>
        <div class="hero-image">
          <img src="/images/hero-car.png" alt="Автомобиль каршеринга">
        </div>
      </div>
    </div>
  </section>

  <section class="features">
    <div class="container">
      <h2>Почему мы</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">&#9889;</div>
          <h3>Быстрый старт</h3>
          <p>Регистрация за 5 минут. Никаких очередей и бумажной волокиты.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">&#128275;</div>
          <h3>Открытие в приложении</h3>
          <p>Открывайте автомобиль через смартфон. Ключи не нужны.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">&#128179;</div>
          <h3>Прозрачные тарифы</h3>
          <p>Никаких скрытых платежей. Платите только за время поездки.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="stats">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-item">
          <h3>{{ stats.carsCount }}+</h3>
          <p>Автомобилей</p>
        </div>
        <div class="stat-item">
          <h3>{{ stats.usersCount }}+</h3>
          <p>Клиентов</p>
        </div>
        <div class="stat-item">
          <h3>0/7</h3>
          <p>Поддержка</p>
        </div>
        <div class="stat-item">
          <h3>{{ stats.citiesCount }}</h3>
          <p>Город</p>
        </div>
      </div>
    </div>
  </section>

  <section class="fleet">
    <div class="container">
      <h2>Наш автопарк</h2>
      <div v-if="loading" class="fleet-loading">
        <p>Загрузка автомобилей...</p>
      </div>
      <div v-else-if="error" class="fleet-error">
        <p>{{ error }}</p>
      </div>
      <div v-else class="fleet-grid">
        <div v-for="car in cars" :key="car.id" class="car-card">
          <div class="car-image">
            <img :src="car.imageUrl || '/images/tesla.png'" :alt="car.brand + ' ' + car.model">
          </div>
          <div class="car-info">
            <h3>{{ car.brand }} {{ car.model }}</h3>
            <p>{{ car.carType || 'Стандарт' }} • {{ car.transmission === 'automatic' ? 'Автомат' : 'Механика' }}</p>
            <div class="car-price">
              <span class="price">{{ car.tariff?.pricePerMinute || 0 }} BYN <span>/ час</span></span>
              <router-link to="/catalog" class="btn btn-outline">Выбрать</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="cta">
    <div class="container">
      <div class="cta-card">
        <h2>Готовы к поездке?</h2>
        <p>Скачайте приложение и получите 30 минут бесплатно</p>
        <button class="btn btn-primary">Скачать приложение</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCars } from '../composables/useApi'

const cars = ref([])
const loading = ref(false)
const error = ref(null)

const stats = ref({
  carsCount: 6,
  usersCount: 1,
  citiesCount: 1
})

const { getAvailable } = useCars()

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const result = await getAvailable()
    if (result.success && Array.isArray(result.data)) {
      cars.value = result.data.slice(0, 6)
      stats.value.carsCount = result.data.length
    }
  } catch (e) {
    error.value = 'Не удалось загрузить данные об автомобилях'
    console.error('Ошибка загрузки автопарка:', e)
  } finally {
    loading.value = false
  }
})
</script>
