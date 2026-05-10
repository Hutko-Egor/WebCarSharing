<template>
  <div class="catalog-page">
    <section class="catalog-hero">
      <div class="container">
        <h1>Каталог автомобилей</h1>
        <p>Выберите идеальный автомобиль для вашей поездки</p>
      </div>
    </section>

    <section class="catalog-section">
      <div class="container">
        <div class="catalog-layout">

          <aside class="filters">
            <div class="filter-header">
              <h3>Фильтры</h3>
              <button class="reset-filters" @click="resetFilters" :disabled="loading">Сбросить</button>
            </div>

            <div class="filter-group">
              <label>Класс автомобиля</label>
              <div class="checkbox-group">
                <label class="checkbox" v-for="cls in carClasses" :key="cls.value">
                  <input type="checkbox" v-model="selectedClasses" :value="cls.value">
                  <span>{{ cls.label }}</span>
                </label>
              </div>
            </div>

            <div class="filter-group">
              <label>Трансмиссия</label>
              <div class="checkbox-group">
                <label class="checkbox" v-for="trans in transmissions" :key="trans.value">
                  <input type="checkbox" v-model="selectedTransmissions" :value="trans.value">
                  <span>{{ trans.label }}</span>
                </label>
              </div>
            </div>

          </aside>

          <main class="catalog-content">
            <div class="catalog-header">
              <div class="sort-options">
                <span>Сортировать:</span>
                <select class="sort-select" v-model="sortBy" :disabled="loading">
                  <option value="popular">По популярности</option>
                  <option value="price-asc">По цене (возрастание)</option>
                  <option value="price-desc">По цене (убывание)</option>
                  <option value="newest">Новинки</option>
                </select>
              </div>
            </div>

            <div v-if="loading" class="fleet-grid" :class="`view-${viewMode}`">
              <SkeletonCarCard v-for="i in itemsPerPage" :key="i" />
            </div>

            <div v-else-if="sortedCars.length === 0" class="empty-state">
              <p>Автомобили не найдены. Попробуйте изменить фильтры.</p>
            </div>

            <div v-else class="fleet-grid" :class="`view-${viewMode}`">
              <div class="car-card" v-for="car in paginatedCars" :key="car.id">
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
                    <span class="price">{{ car.tariff?.pricePerMinute || 0 }} BYN <span>/ час</span></span>
                    <router-link :to="`/car/${car.id}`" class="btn btn-outline btn-sm">Подробнее</router-link>
                  </div>
                </div>
              </div>
            </div>

            <div class="pagination" v-if="totalPages > 1 && !loading">
              <button class="page-btn arrow" :disabled="currentPage === 1" @click="currentPage--">&larr;</button>
              
              <button
                v-for="page in displayedPages"
                :key="page"
                class="page-btn"
                :class="{ active: currentPage === page }"
                @click="currentPage = page"
              >
                {{ page }}
              </button>

              <button class="page-btn arrow" :disabled="currentPage === totalPages" @click="currentPage++">&rarr;</button>
            </div>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCars, useFavorites } from '../composables/useApi'
import { useAuthStore } from '../composables/useAuthStore'
import SkeletonCarCard from '../components/SkeletonCarCard.vue'

const router = useRouter()
const auth = useAuthStore()
const carsApi = useCars()
const favoritesApi = useFavorites()

const allCars = ref([])
const loading = ref(true)
const favoriteIds = ref(new Set())

const selectedClasses = ref([])
const selectedTransmissions = ref([])
const sortBy = ref('popular')
const viewMode = ref('grid')
const currentPage = ref(1)
const itemsPerPage = 6

const carClasses = [
  { value: 'economy', label: 'Эконом' },
  { value: 'comfort', label: 'Комфорт' },
  { value: 'business', label: 'Бизнес' },
  { value: 'premium', label: 'Премиум' },
];
const transmissions = [
  { value: 'automatic', label: 'Автомат' },
  { value: 'manual', label: 'Механика' },
];

const filteredCars = computed(() => {
  return allCars.value.filter(car => {
    if (selectedClasses.value.length > 0 && !selectedClasses.value.includes(car.carType)) return false
    if (selectedTransmissions.value.length > 0 && !selectedTransmissions.value.includes(car.transmission)) return false
    return true
  })
})

const sortedCars = computed(() => {
  const cars = [...filteredCars.value]
  const getPrice = (c) => c.tariff?.pricePerMinute || 0
  switch (sortBy.value) {
    case 'price-asc': return cars.sort((a, b) => getPrice(a) - getPrice(b))
    case 'price-desc': return cars.sort((a, b) => getPrice(b) - getPrice(a))
    case 'newest': return cars.sort((a, b) => (b.year || 0) - (a.year || 0))
    default: return cars
  }
})

const totalPages = computed(() => Math.ceil(sortedCars.value.length / itemsPerPage))

const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const maxVisible = 5
  
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  let start = Math.max(current - Math.floor(maxVisible / 2), 1)
  let end = start + maxVisible - 1

  if (end > total) {
    end = total
    start = end - maxVisible + 1
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const paginatedCars = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return sortedCars.value.slice(start, start + itemsPerPage)
})

// Сброс на 1 страницу при смене фильтров
watch([selectedClasses, selectedTransmissions], () => {
  currentPage.value = 1
})

function resetFilters() {
  selectedClasses.value = []
  selectedTransmissions.value = []
  sortBy.value = 'popular'
  currentPage.value = 1
}

async function toggleFavorite(carId) {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  await favoritesApi.toggle(carId)
  const result = await favoritesApi.getFavorites()
  if (result.success) {
    favoriteIds.value = new Set(result.data.map(f => f.carId || f.id))
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const result = await carsApi.getAll()
    if (result.success) {
      allCars.value = result.data || []
    }
  } catch (e) {
    console.error('Failed to load cars:', e)
  } finally {
    setTimeout(() => { loading.value = false }, 600)
  }

  if (auth.isAuthenticated) {
    try {
      const result = await favoritesApi.getFavorites()
      if (result.success) {
        favoriteIds.value = new Set(result.data.map(f => f.carId || f.id))
      }
    } catch (e) {
      console.error('Failed to load favorites:', e)
    }
  }
})
</script>

<style scoped>
.pagination {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 40px;
  align-items: center;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  border: 1px solid #252525;
  background: #1c1c1c;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn.active {
  background-color: #1ea35a;
  border-color: #34dbac;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.arrow {
  font-weight: bold;
  font-size: 1.2rem;
}

.apply-filters:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-weight: 600;
}
</style>