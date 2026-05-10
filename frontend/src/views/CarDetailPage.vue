<template>
  <div class="car-detail-page">

    <!-- LOADING -->
    <div v-if="loading" class="detail-loading">
      <div class="container">
        <div class="skeleton-back skeleton-pulse"></div>
        <div class="skeleton-layout">
          <div class="skeleton-img skeleton-pulse"></div>
          <div class="skeleton-info">
            <div class="skeleton-line wide skeleton-pulse"></div>
            <div class="skeleton-line medium skeleton-pulse"></div>
            <div class="skeleton-price-box skeleton-pulse"></div>
            <div class="skeleton-specs">
              <div class="skeleton-spec skeleton-pulse" v-for="i in 4" :key="i"></div>
            </div>
            <div class="skeleton-btn skeleton-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="detail-error">
      <div class="container">
        <div class="error-card">
          <div class="error-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2>Автомобиль не найден</h2>
          <p>{{ error }}</p>
          <router-link to="/catalog" class="btn btn-primary">Вернуться в каталог</router-link>
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <template v-else-if="car">

      <!-- HERO-БАННЕР -->
      <section class="detail-hero" :style="car.imageUrl ? `--hero-img: url('${car.imageUrl}')` : ''">
        <div class="hero-overlay"></div>
        <div class="container">
          <router-link to="/catalog" class="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Назад в каталог
          </router-link>
          <div class="hero-badges">
            <span class="status-badge" :class="statusClass">{{ statusLabel }}</span>
            <span class="type-badge" v-if="car.carType">{{ carTypeLabel }}</span>
          </div>
          <h1 class="hero-title">
            {{ car.brand }} <span class="accent">{{ car.model }}</span>
          </h1>
          <p class="hero-sub">{{ car.year }} г. &nbsp;·&nbsp; {{ transmissionLabel }} &nbsp;·&nbsp; {{ car.seats }} мест</p>
        </div>
      </section>

      <!-- ОСНОВНОЙ БЛОК -->
      <section class="detail-main">
        <div class="container">
          <div class="detail-layout">

            <!-- ЛЕВАЯ КОЛОНКА -->
            <div class="detail-left">

              <div class="main-photo-wrap">
                <img
                  :src="car.imageUrl || 'https://loremflickr.com/800/600/car'"
                  :alt="`${car.brand} ${car.model}`"
                  class="main-photo"
                  @error="onImgError"
                />
                <div class="photo-overlay-tag">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  Реальное фото
                </div>
              </div>

              <div class="specs-card">
                <h3 class="specs-title">Технические характеристики</h3>
                <div class="specs-grid">
                  <div class="spec-item" v-for="spec in specsList" :key="spec.label">
                    <div class="spec-icon" v-html="spec.icon"></div>
                    <div class="spec-data">
                      <span class="spec-label">{{ spec.label }}</span>
                      <span class="spec-value">{{ spec.value }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="plate-card">
                <span class="plate-label">Государственный номер</span>
                <div class="plate-number">
                  <span class="plate-flag">🇧🇾</span>
                  {{ car.licensePlate || '—' }}
                </div>
              </div>
            </div>

            <!-- ПРАВАЯ КОЛОНКА -->
            <div class="detail-right">

              <div class="tariff-card" v-if="car.tariff">
                <div class="tariff-header">
                  <div>
                    <h3>{{ car.tariff.name || 'Стандарт' }}</h3>
                    <p class="tariff-desc">{{ car.tariff.description || 'Оплата за время аренды' }}</p>
                  </div>
                  <div class="tariff-badge">Тариф</div>
                </div>
                <div class="tariff-prices">
                  <div class="price-row main-price">
                    <span class="price-val">{{ formatPrice(car.tariff.pricePerMinute) }}</span>
                    <span class="price-unit">BYN / мин</span>
                  </div>
                  <div class="price-row" v-if="car.tariff.pricePerHour">
                    <span class="price-val-sm">{{ formatPrice(car.tariff.pricePerHour) }}</span>
                    <span class="price-unit-sm">BYN / час</span>
                  </div>
                  <div class="price-row" v-if="car.tariff.pricePerDay">
                    <span class="price-val-sm">{{ formatPrice(car.tariff.pricePerDay) }}</span>
                    <span class="price-unit-sm">BYN / сутки</span>
                  </div>
                </div>
              </div>

              <div class="tariff-card tariff-empty" v-else>
                <p>Тариф не указан. Уточните стоимость у поддержки.</p>
              </div>

              <!-- КАЛЬКУЛЯТОР -->
              <div class="calc-card" v-if="car.tariff?.pricePerMinute">
                <h3 class="calc-title">Рассчитать стоимость</h3>
                <div class="calc-row">
                  <label>Длительность</label>
                  <div class="duration-tabs">
                    <button
                      v-for="d in durations" :key="d.value"
                      class="dur-btn"
                      :class="{ active: selectedDuration === d.value }"
                      @click="selectedDuration = d.value"
                    >{{ d.label }}</button>
                  </div>
                </div>
                <div class="calc-result">
                  <span class="calc-label">Итого:</span>
                  <span class="calc-price">≈ {{ calcPrice }} BYN</span>
                </div>
              </div>

              <!-- БРОНИРОВАНИЕ -->
              <div class="book-card">
                <h3 class="book-title">Бронирование</h3>

                <div v-if="car.status === 'available'" class="book-form">
                  <div class="form-group">
                    <label>Дата и время начала</label>
                    <input type="datetime-local" v-model="bookStart" :min="minDate" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Дата и время окончания</label>
                    <input type="datetime-local" v-model="bookEnd" :min="bookStart || minDate" class="form-input" />
                  </div>

                  <div class="book-estimate" v-if="bookDuration > 0">
                    <div class="estimate-row">
                      <span>Длительность</span>
                      <span>{{ bookDurationLabel }}</span>
                    </div>
                    <div class="estimate-row total">
                      <span>Стоимость</span>
                      <span class="estimate-price">{{ bookTotalPrice }} BYN</span>
                    </div>
                  </div>

                  <div class="book-error" v-if="bookError">{{ bookError }}</div>
                  <div class="book-success" v-if="bookSuccess">{{ bookSuccess }}</div>

                  <button
                    class="btn btn-primary book-btn"
                    @click="handleBook"
                    :disabled="booking || !bookStart || !bookEnd"
                  >
                    <span v-if="booking" class="spinner-sm"></span>
                    <span v-else>Забронировать</span>
                  </button>

                  <p class="book-note" v-if="!isAuthenticated">
                    <router-link to="/login">Войдите</router-link>, чтобы оформить бронь
                  </p>
                </div>

                <div v-else class="unavailable-block">
                  <div class="unavail-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M15 9l-6 6M9 9l6 6"/>
                    </svg>
                  </div>
                  <p>Автомобиль сейчас <strong>недоступен</strong></p>
                  <p class="unavail-sub">Попробуйте другой автомобиль из каталога</p>
                  <router-link to="/catalog" class="btn btn-outline" style="display:inline-block;margin-top:16px">
                    Смотреть каталог
                  </router-link>
                </div>
              </div>

              <button class="fav-btn" @click="toggleFav" v-if="isAuthenticated">
                <svg width="20" height="20" viewBox="0 0 24 24"
                  :fill="isFav ? 'currentColor' : 'none'"
                  stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {{ isFav ? 'В избранном' : 'Добавить в избранное' }}
              </button>

            </div>
          </div>
        </div>
      </section>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../composables/useAuthStore'
import { useFavorites, API_URL } from '../composables/useApi'

const route  = useRoute()
const router = useRouter()
const { isAuthenticated, token } = useAuthStore()
const favoritesApi = useFavorites()

const car     = ref(null)
const loading = ref(true)
const error   = ref(null)
const isFav   = ref(false)

// Бронирование
const bookStart   = ref('')
const bookEnd     = ref('')
const booking     = ref(false)
const bookError   = ref('')
const bookSuccess = ref('')

// Калькулятор
const durations = [
  { label: '1 ч',  value: 60   },
  { label: '3 ч',  value: 180  },
  { label: '8 ч',  value: 480  },
  { label: '24 ч', value: 1440 },
]
const selectedDuration = ref(60)

const calcPrice = computed(() => {
  if (!car.value?.tariff?.pricePerMinute) return '—'
  return (car.value.tariff.pricePerMinute * selectedDuration.value).toFixed(2)
})

const minDate = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
})

const bookDuration = computed(() => {
  if (!bookStart.value || !bookEnd.value) return 0
  return Math.max(0, Math.floor((new Date(bookEnd.value) - new Date(bookStart.value)) / 60000))
})

const bookDurationLabel = computed(() => {
  const m = bookDuration.value
  if (!m) return '—'
  const h = Math.floor(m / 60), min = m % 60
  if (!h)   return `${min} мин`
  if (!min) return `${h} ч`
  return `${h} ч ${min} мин`
})

const bookTotalPrice = computed(() => {
  if (!car.value?.tariff?.pricePerMinute || !bookDuration.value) return '—'
  return (car.value.tariff.pricePerMinute * bookDuration.value).toFixed(2)
})

const statusClass = computed(() => ({
  available:   'status-available',
  booked:      'status-booked',
  in_use:      'status-in-use',
  maintenance: 'status-maintenance',
}[car.value?.status] || 'status-maintenance'))

const statusLabel = computed(() => ({
  available:   'Доступна',
  booked:      'Забронирована',
  in_use:      'В аренде',
  maintenance: 'На обслуживании',
}[car.value?.status] || car.value?.status))

const carTypeLabel = computed(() => ({
  economy: 'Эконом', comfort: 'Комфорт', business: 'Бизнес', premium: 'Премиум',
}[car.value?.carType] || car.value?.carType))

const transmissionLabel = computed(() =>
  car.value?.transmission === 'automatic' ? 'Автомат' : 'Механика'
)

const specsList = computed(() => {
  if (!car.value) return []
  return [
    { label: 'Год выпуска',        value: car.value.year || '—',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
    { label: 'Трансмиссия',        value: transmissionLabel.value,
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><line x1="12" y1="9" x2="7" y2="6.5"/><line x1="12" y1="9" x2="17" y2="6.5"/><line x1="12" y1="15" x2="7" y2="17.5"/></svg>` },
    { label: 'Количество мест',    value: car.value.seats ? `${car.value.seats} места` : '—',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
    { label: 'Класс автомобиля',   value: carTypeLabel.value || '—',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>` },
    { label: 'Цвет',               value: car.value.color || '—',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 22c4.97 0 9-2.69 9-6s-4.03-6-9-6S3 12.69 3 16s4.03 6 9 6z"/></svg>` },
    { label: 'Статус',             value: statusLabel.value,
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` },
  ]
})

function formatPrice(val) {
  return (val != null) ? Number(val).toFixed(2) : '—'
}

function onImgError(e) {
  e.target.src = 'https://loremflickr.com/800/600/car,automobile'
}

onMounted(async () => {
  const id = route.params.id
  try {
    const res  = await fetch(`${API_URL}/cars/${id}`)
    const json = await res.json()
    if (json.success && json.data) {
      car.value = json.data
    } else {
      error.value = json.message || 'Автомобиль не найден'
    }
  } catch {
    error.value = 'Не удалось подключиться к серверу'
  } finally {
    loading.value = false
  }

  if (isAuthenticated.value) {
    try {
      const favRes = await favoritesApi.getFavorites()
      if (favRes.success) {
        isFav.value = favRes.data.some(f => (f.id || f.carId) === Number(id))
      }
    } catch {}
  }
})

async function handleBook() {
  bookError.value = ''
  bookSuccess.value = ''

  if (!isAuthenticated.value) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }
  if (!bookStart.value || !bookEnd.value) {
    bookError.value = 'Укажите дату и время начала и окончания'
    return
  }
  if (new Date(bookEnd.value) <= new Date(bookStart.value)) {
    bookError.value = 'Время окончания должно быть позже времени начала'
    return
  }

  booking.value = true
  try {
    const res  = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token.value}` },
      body: JSON.stringify({
        carId:     Number(route.params.id),
        startTime: new Date(bookStart.value).toISOString(),
        endTime:   new Date(bookEnd.value).toISOString(),
      })
    })
    const json = await res.json()
    if (json.success) {
      bookSuccess.value = `Бронь оформлена! Стоимость: ${json.data?.totalPrice?.toFixed(2) || bookTotalPrice.value} BYN`
      bookStart.value = ''
      bookEnd.value = ''
      car.value.status = 'booked'
    } else {
      bookError.value = json.message || 'Ошибка при бронировании'
    }
  } catch {
    bookError.value = 'Ошибка соединения с сервером'
  } finally {
    booking.value = false
  }
}

async function toggleFav() {
  try {
    await favoritesApi.toggle(Number(route.params.id))
    isFav.value = !isFav.value
  } catch {}
}
</script>

<style scoped>
.car-detail-page { min-height: 100vh; background: #050505; }

/* Скелетон */
.detail-loading { padding: 140px 0 80px; }
.skeleton-back { width: 160px; height: 20px; background: #1a1a1a; border-radius: 8px; margin-bottom: 40px; }
.skeleton-layout { display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px; }
.skeleton-img { height: 480px; border-radius: 24px; background: #111; }
.skeleton-info { display: flex; flex-direction: column; gap: 20px; }
.skeleton-line { height: 18px; border-radius: 8px; background: #111; }
.skeleton-line.wide { width: 80%; height: 40px; }
.skeleton-line.medium { width: 55%; }
.skeleton-price-box { height: 100px; border-radius: 16px; background: #111; }
.skeleton-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.skeleton-spec { height: 60px; border-radius: 12px; background: #111; }
.skeleton-btn { height: 56px; border-radius: 100px; background: #111; }
.skeleton-pulse { animation: pulse 1.6s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

/* Ошибка */
.detail-error { display:flex; align-items:center; justify-content:center; min-height:100vh; padding:80px 20px; }
.error-card { background:#0a0a0a; border:1px solid #1a1a1a; border-radius:32px; padding:64px; text-align:center; max-width:480px; }
.error-icon { color:#333; margin-bottom:24px; display:flex; justify-content:center; }
.error-card h2 { font-size:28px; font-weight:700; margin-bottom:12px; }
.error-card p { color:#666; margin-bottom:32px; }

/* Hero */
.detail-hero {
  position:relative; padding:160px 0 80px; min-height:340px; overflow:hidden;
  background: linear-gradient(to bottom,rgba(5,5,5,.6) 0%,rgba(5,5,5,.95) 100%),
              var(--hero-img,#111) center/cover no-repeat;
}
.hero-overlay { position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(ellipse at 60% 50%,rgba(0,220,130,.08) 0%,transparent 70%); }
.back-link { display:inline-flex; align-items:center; gap:8px; color:#888; text-decoration:none;
  font-size:14px; font-weight:500; margin-bottom:32px; transition:color .3s; }
.back-link:hover { color:#00dc82; }
.hero-badges { display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap; }
.status-badge, .type-badge { padding:6px 16px; border-radius:100px; font-size:13px;
  font-weight:600; text-transform:uppercase; letter-spacing:.5px; }
.status-available  { background:rgba(0,220,130,.15);  color:#00dc82; border:1px solid rgba(0,220,130,.3); }
.status-booked     { background:rgba(255,180,0,.15);  color:#ffb400; border:1px solid rgba(255,180,0,.3); }
.status-in-use     { background:rgba(255,100,60,.15); color:#ff643c; border:1px solid rgba(255,100,60,.3); }
.status-maintenance{ background:rgba(100,100,100,.15);color:#888;    border:1px solid #333; }
.type-badge { background:rgba(255,255,255,.07); color:#ccc; border:1px solid #2a2a2a; }
.hero-title { font-size:60px; font-weight:800; letter-spacing:-2px; line-height:1.05; margin:0 0 16px; }
.accent { background:linear-gradient(135deg,#00dc82 0%,#00ff95 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.hero-sub { font-size:18px; color:#666; margin:0; }

/* Основной блок */
.detail-main { padding:64px 0 120px; }
.detail-layout { display:grid; grid-template-columns:1.1fr 1fr; gap:48px; align-items:start; }

/* Левая колонка */
.main-photo-wrap { position:relative; border-radius:24px; overflow:hidden;
  background:#0a0a0a; border:1px solid #1a1a1a; margin-bottom:24px; }
.main-photo { width:100%; aspect-ratio:16/10; object-fit:cover; display:block; transition:transform .5s ease; }
.main-photo-wrap:hover .main-photo { transform:scale(1.02); }
.photo-overlay-tag { position:absolute; bottom:16px; left:16px;
  background:rgba(10,10,10,.85); backdrop-filter:blur(8px); border:1px solid #2a2a2a;
  border-radius:10px; padding:8px 14px; font-size:13px; color:#888;
  display:flex; align-items:center; gap:6px; }

.specs-card { background:#0a0a0a; border:1px solid #1a1a1a; border-radius:24px; padding:32px; margin-bottom:20px; }
.specs-title { font-size:16px; font-weight:700; color:#888; text-transform:uppercase;
  letter-spacing:.5px; margin:0 0 24px; }
.specs-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.spec-item { display:flex; align-items:center; gap:14px; background:#050505;
  border:1px solid #1a1a1a; border-radius:14px; padding:16px; transition:border-color .3s; }
.spec-item:hover { border-color:#2a2a2a; }
.spec-icon { color:#00dc82; flex-shrink:0; display:flex; }
.spec-data { display:flex; flex-direction:column; gap:3px; }
.spec-label { font-size:12px; color:#555; text-transform:uppercase; letter-spacing:.3px; }
.spec-value { font-size:15px; font-weight:600; color:#fff; }

.plate-card { background:#0a0a0a; border:1px solid #1a1a1a; border-radius:16px;
  padding:20px 24px; display:flex; align-items:center; justify-content:space-between; }
.plate-label { font-size:13px; color:#555; }
.plate-number { display:flex; align-items:center; gap:10px; font-family:monospace;
  font-size:20px; font-weight:700; background:#fff; color:#000;
  padding:6px 18px; border-radius:6px; letter-spacing:2px; }

/* Правая колонка */
.detail-right { display:flex; flex-direction:column; gap:20px; position:sticky; top:110px; }

.tariff-card { background:#0a0a0a; border:1px solid #1a1a1a; border-radius:24px; padding:28px; }
.tariff-empty p { color:#555; text-align:center; padding:16px 0; }
.tariff-header { display:flex; align-items:flex-start; justify-content:space-between;
  gap:16px; margin-bottom:24px; padding-bottom:24px; border-bottom:1px solid #1a1a1a; }
.tariff-header h3 { font-size:20px; font-weight:700; margin:0 0 6px; }
.tariff-desc { font-size:14px; color:#555; margin:0; }
.tariff-badge { background:rgba(0,220,130,.1); color:#00dc82; border:1px solid rgba(0,220,130,.25);
  border-radius:100px; font-size:12px; font-weight:600; padding:4px 12px; white-space:nowrap; }
.tariff-prices { display:flex; flex-direction:column; gap:12px; }
.price-row { display:flex; align-items:baseline; gap:8px; }
.price-val { font-size:40px; font-weight:800; line-height:1;
  background:linear-gradient(135deg,#00dc82 0%,#00ff95 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.price-unit { font-size:16px; color:#555; }
.price-val-sm { font-size:22px; font-weight:700; color:#888; }
.price-unit-sm { font-size:14px; color:#444; }

.calc-card { background:#0a0a0a; border:1px solid #1a1a1a; border-radius:24px; padding:28px; }
.calc-title { font-size:16px; font-weight:700; margin:0 0 20px; }
.calc-row { margin-bottom:20px; }
.calc-row label { display:block; font-size:13px; color:#555; margin-bottom:10px;
  text-transform:uppercase; letter-spacing:.3px; }
.duration-tabs { display:flex; gap:8px; flex-wrap:wrap; }
.dur-btn { padding:8px 18px; background:#111; border:1px solid #1a1a1a; border-radius:100px;
  color:#888; font-size:14px; font-weight:500; cursor:pointer; transition:all .2s; }
.dur-btn:hover { border-color:#333; color:#fff; }
.dur-btn.active { background:linear-gradient(135deg,#00dc82 0%,#00ff95 100%);
  border-color:transparent; color:#000; font-weight:700; }
.calc-result { display:flex; align-items:center; justify-content:space-between;
  background:#050505; border:1px solid #1a1a1a; border-radius:14px; padding:16px 20px; }
.calc-label { font-size:14px; color:#555; }
.calc-price { font-size:22px; font-weight:800;
  background:linear-gradient(135deg,#00dc82 0%,#00ff95 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

.book-card { background:#0a0a0a; border:1px solid #1a1a1a; border-radius:24px; padding:28px; }
.book-title { font-size:18px; font-weight:700; margin:0 0 24px; }
.book-form { display:flex; flex-direction:column; gap:16px; }
.form-group { display:flex; flex-direction:column; gap:8px; }
.form-group label { font-size:13px; color:#555; text-transform:uppercase; letter-spacing:.3px; }
.form-input { background:#050505; border:1px solid #1a1a1a; border-radius:12px; color:#fff;
  font-size:15px; padding:14px 16px; font-family:inherit; transition:border-color .3s;
  outline:none; width:100%; box-sizing:border-box; }
.form-input:focus { border-color:#00dc82; }
.form-input::-webkit-calendar-picker-indicator { filter:invert(.5); cursor:pointer; }

.book-estimate { background:#050505; border:1px solid #1a1a1a; border-radius:14px;
  padding:16px 20px; display:flex; flex-direction:column; gap:10px; }
.estimate-row { display:flex; justify-content:space-between; font-size:14px; color:#888; }
.estimate-row.total { border-top:1px solid #1a1a1a; padding-top:10px; font-weight:600; color:#fff; }
.estimate-price { font-size:18px; font-weight:800;
  background:linear-gradient(135deg,#00dc82 0%,#00ff95 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

.book-error { background:rgba(220,50,50,.1); border:1px solid rgba(220,50,50,.3);
  color:#ff6464; border-radius:10px; padding:12px 16px; font-size:14px; }
.book-success { background:rgba(0,220,130,.1); border:1px solid rgba(0,220,130,.3);
  color:#00dc82; border-radius:10px; padding:12px 16px; font-size:14px; }

.book-btn { width:100%; display:flex; align-items:center; justify-content:center;
  gap:10px; font-size:16px; letter-spacing:.5px; }
.book-btn:disabled { opacity:.5; cursor:not-allowed; transform:none!important; }

.spinner-sm { width:18px; height:18px; border:2px solid rgba(0,0,0,.3);
  border-top-color:#000; border-radius:50%; animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

.book-note { text-align:center; font-size:13px; color:#555; margin:0; }
.book-note a { color:#00dc82; text-decoration:none; }

.unavailable-block { text-align:center; padding:24px 0 8px; }
.unavail-icon { color:#333; margin-bottom:16px; display:flex; justify-content:center; }
.unavailable-block p { font-size:16px; color:#ccc; margin:0 0 8px; }
.unavail-sub { font-size:14px; color:#555!important; }

.fav-btn { display:flex; align-items:center; justify-content:center; gap:10px;
  width:100%; padding:16px; background:transparent; border:1px solid #1a1a1a;
  border-radius:100px; color:#666; font-size:15px; font-weight:500;
  font-family:inherit; cursor:pointer; transition:all .3s; }
.fav-btn:hover { border-color:#00dc82; color:#00dc82; }

@media (max-width:1024px) {
  .detail-layout { grid-template-columns:1fr; }
  .detail-right { position:static; }
  .skeleton-layout { grid-template-columns:1fr; }
}
@media (max-width:640px) {
  .hero-title { font-size:36px; }
  .specs-grid { grid-template-columns:1fr; }
}
</style>