<template>
  <div class="favorites-page-wrapper">
    <main class="favorites-page">
      <div class="container">

        <div class="favorites-header">
          <h1>Избранное</h1>
          <p>Сохранённые автомобили для быстрого доступа</p>
        </div>

        <div v-if="loading" class="loading-state">
          <p>Загрузка избранного...</p>
        </div>

        <div v-else class="favorites-content">

          <div v-if="favoriteCars.length > 0" class="favorites-grid">
            <div class="car-card favorite-card" v-for="car in favoriteCars" :key="car.id">
              <div class="car-image">
                <img :src="car.imageUrl || '/images/tesla.png'" :alt="car.brand + ' ' + car.model">
                <button
                  class="favorite-btn active"
                  @click="removeFromFavorites(car.id)"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
                <span class="availability-badge" :class="{ busy: car.status !== 'available' }">
                  {{ car.status === 'available' ? 'Доступен' : 'Занят' }}
                </span>
              </div>
              <div class="car-info">
                <h3>{{ car.brand }} {{ car.model }}</h3>
                <p>{{ car.carType || 'Стандарт' }} • {{ car.transmission === 'automatic' ? 'Автомат' : 'Механика' }}</p>
                <div class="car-specs">
                  <span class="spec" v-if="car.year">⚡ {{ car.year }} г.</span>
                  <span class="spec" v-if="car.seats">👥 {{ car.seats }} мест</span>
                </div>
                <div class="car-price">
                  <span class="price">{{ car.tariff?.pricePerMinute || 0 }} BYN <span>/ мин</span></span>
                  <router-link :to="`/car/${car.id}`" class="btn btn-outline btn-sm">Забронировать</router-link>
                </div>
              </div>
            </div>
          </div>

          <div v-if="favoriteCars.length === 0" class="empty-favorites">
            <div class="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2>Нет избранных автомобилей</h2>
            <p>Добавляйте автомобили в избранное, чтобы быстро находить их</p>
            <router-link to="/catalog" class="btn btn-primary">Перейти в каталог</router-link>
          </div>

          <section class="recommendations" v-if="recommendedCars.length > 0">
            <h2>Рекомендуем также</h2>
            <div class="fleet-grid">
              <div class="car-card" v-for="car in recommendedCars" :key="car.id">
                <div class="car-image">
                  <img :src="car.imageUrl || '/images/tesla.png'" :alt="car.brand + ' ' + car.model">
                  <button
                    class="favorite-btn"
                    :class="{ active: favoriteIds.has(car.id) }"
                    @click="toggleFavorite(car.id)"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24"
                         :fill="favoriteIds.has(car.id) ? 'currentColor' : 'none'"
                         stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
                <div class="car-info">
                  <h3>{{ car.brand }} {{ car.model }}</h3>
                  <p>{{ car.carType || 'Стандарт' }} • {{ car.transmission === 'automatic' ? 'Автомат' : 'Механика' }}</p>
                  <div class="car-specs">
                    <span class="spec" v-if="car.year">⚡ {{ car.year }} г.</span>
                    <span class="spec" v-if="car.seats">👥 {{ car.seats }} мест</span>
                  </div>
                  <div class="car-price">
                    <span class="price">{{ car.tariff?.pricePerMinute || 0 }} BYN <span>/ мин</span></span>
                    <router-link :to="`/car/${car.id}`" class="btn btn-outline btn-sm">Подробнее</router-link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCars, useFavorites } from '../composables/useApi'
import { useAuthStore } from '../composables/useAuthStore'

const router = useRouter()
const auth = useAuthStore()
const carsApi = useCars()
const favoritesApi = useFavorites()

const favoriteCars = ref([])
const allCars = ref([])
const favoriteIds = ref(new Set())
const loading = ref(true)

const favoriteCarIds = computed(() => new Set(favoriteCars.value.map(c => c.id)))

const recommendedCars = computed(() => {
  return allCars.value
    .filter(car => !favoriteCarIds.value.has(car.id))
    .slice(0, 3)
})

async function removeFromFavorites(carId) {
  await favoritesApi.toggle(carId)
  favoriteCars.value = favoriteCars.value.filter(c => c.id !== carId)
  favoriteIds.value.delete(carId)
}

async function toggleFavorite(carId) {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  await favoritesApi.toggle(carId)
  if (favoriteIds.value.has(carId)) {
    favoriteIds.value.delete(carId)
    favoriteCars.value = favoriteCars.value.filter(c => c.id !== carId)
  } else {
    favoriteIds.value.add(carId)
    const car = allCars.value.find(c => c.id === carId)
    if (car) favoriteCars.value.push(car)
  }
}

onMounted(async () => {
  try {
    const favResult = await favoritesApi.getFavorites()
    let favCarIds = []
    if (favResult.success) {
      favCarIds = favResult.data.map(f => f.carId || f.id)
    }
    favoriteIds.value = new Set(favCarIds)

    const carsResult = await carsApi.getAll()
    if (carsResult.success) {
      allCars.value = carsResult.data || []
    }

    favoriteCars.value = allCars.value.filter(car => favCarIds.includes(car.id))
  } catch (e) {
    console.error('Failed to load favorites:', e)
  } finally {
    loading.value = false
  }
})
</script>
