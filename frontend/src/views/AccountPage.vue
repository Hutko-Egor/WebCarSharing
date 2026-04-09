<template>
  <main class="account-page">
    <div class="container">
      <div class="account-layout">
        <aside class="account-nav">
          <div class="profile-mini">
            <div class="avatar-large">{{ avatarLetter }}</div>
            <div class="profile-info">
              <span class="profile-name user-name">{{ displayName }}</span>
              <span class="profile-email user-email">{{ user?.email || '' }}</span>
            </div>
          </div>

          <ul class="account-menu">
            <li v-for="item in menuItems" :key="item.id">
              <a
                :href="'#' + item.id"
                :class="{ active: activeSection === item.id }"
                @click.prevent="activeSection = item.id"
              >
                <span v-html="item.icon"></span>
                {{ item.label }}
              </a>
            </li>
          </ul>

          <button class="logout-btn" @click="handleLogout">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V6h2v4z"/>
            </svg>
            Выйти
          </button>

          <router-link
            v-if="isAdmin"
            to="/admin"
            class="admin-link"
            style="display: block; margin-top: 16px; padding: 12px 16px; background: rgba(0, 220, 130, 0.1); border-radius: 12px; color: #00DC82; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center;"
          >
            &#9889; Админ-панель
          </router-link>
        </aside>

        <main class="account-content">
          <!-- Обзор -->
          <section id="overview" v-show="activeSection === 'overview'" class="account-section active">
            <h1>Обзор</h1>

            <div class="stats-cards">
              <div class="stat-card">
                <div class="stat-icon">&#128663;</div>
                <div class="stat-info">
                  <span class="stat-value">24</span>
                  <span class="stat-label">Поездки</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">&#9201;&#65039;</div>
                <div class="stat-info">
                  <span class="stat-value">48ч</span>
                  <span class="stat-label">Всего времени</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">&#128205;</div>
                <div class="stat-info">
                  <span class="stat-value">320 км</span>
                  <span class="stat-label">Пробег</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">&#11088;</div>
                <div class="stat-info">
                  <span class="stat-value">4.9</span>
                  <span class="stat-label">Рейтинг</span>
                </div>
              </div>
            </div>

            <div class="balance-card">
              <div class="balance-header">
                <h2>Баланс</h2>
                <button class="top-up-btn">Пополнить</button>
              </div>
              <div class="balance-amount">2 450 &#8381;</div>
              <div class="balance-details">
                <span>Бонусы: 350 &#8381;</span>
                <span>Залог: 5 000 &#8381;</span>
              </div>
            </div>

            <div class="recent-trips">
              <h2>Последние поездки</h2>
              <div class="trip-list">
                <div class="trip-card">
                  <div class="trip-car">
                    <img src="/images/tesla.png" alt="Tesla Model 3">
                  </div>
                  <div class="trip-details">
                    <h4>Tesla Model 3</h4>
                    <p>12 марта 2026 &#8226; 2ч 30мин</p>
                    <span class="trip-status completed">Завершена</span>
                  </div>
                  <div class="trip-price">750 &#8381;</div>
                </div>
                <div class="trip-card">
                  <div class="trip-car">
                    <img src="/images/bmw.png" alt="BMW 3 Series">
                  </div>
                  <div class="trip-details">
                    <h4>BMW 3 Series</h4>
                    <p>10 марта 2026 &#8226; 1ч 15мин</p>
                    <span class="trip-status completed">Завершена</span>
                  </div>
                  <div class="trip-price">450 &#8381;</div>
                </div>
                <div class="trip-card">
                  <div class="trip-car">
                    <img src="/images/vw-polo.png" alt="Volkswagen Polo">
                  </div>
                  <div class="trip-details">
                    <h4>Volkswagen Polo</h4>
                    <p>8 марта 2026 &#8226; 45мин</p>
                    <span class="trip-status completed">Завершена</span>
                  </div>
                  <div class="trip-price">225 &#8381;</div>
                </div>
              </div>
              <a href="#history" class="view-all-link" @click.prevent="activeSection = 'history'">Все поездки &#8594;</a>
            </div>
          </section>

          <!-- История поездок -->
          <section id="history" v-show="activeSection === 'history'" class="account-section">
            <h1>История поездок</h1>

            <div class="history-filters">
              <select class="filter-select">
                <option>Все поездки</option>
                <option>Заверш&#233;нные</option>
                <option>Отмен&#233;нные</option>
                <option>Активные</option>
              </select>
              <input type="date" class="filter-date">
            </div>

            <div class="trip-list full">
              <div class="trip-card detailed">
                <div class="trip-header">
                  <div class="trip-car">
                    <img src="/images/tesla.png" alt="Tesla Model 3">
                  </div>
                  <div class="trip-info">
                    <h4>Tesla Model 3</h4>
                    <p>12 марта 2026, 14:30 - 17:00</p>
                  </div>
                  <span class="trip-status completed">Завершена</span>
                </div>
                <div class="trip-body">
                  <div class="trip-route">
                    <span class="route-point">&#128205; ул. Ленина, 45</span>
                    <span class="route-line"></span>
                    <span class="route-point">&#128205; пр. Мира, 120</span>
                  </div>
                  <div class="trip-stats">
                    <span>&#128207; 45 км</span>
                    <span>&#9201;&#65039; 2ч 30мин</span>
                    <span>&#9981; 12 кВт&#183;ч</span>
                  </div>
                </div>
                <div class="trip-footer">
                  <span class="trip-total">Итого: 750 &#8381;</span>
                  <div class="trip-actions">
                    <button class="btn btn-outline btn-sm">Чек</button>
                    <button class="btn btn-outline btn-sm">Оценить</button>
                  </div>
                </div>
              </div>

              <div class="trip-card detailed">
                <div class="trip-header">
                  <div class="trip-car">
                    <img src="/images/bmw.png" alt="BMW 3 Series">
                  </div>
                  <div class="trip-info">
                    <h4>BMW 3 Series</h4>
                    <p>10 марта 2026, 09:00 - 10:15</p>
                  </div>
                  <span class="trip-status completed">Завершена</span>
                </div>
                <div class="trip-body">
                  <div class="trip-route">
                    <span class="route-point">&#128205; ул. Пушкина, 10</span>
                    <span class="route-line"></span>
                    <span class="route-point">&#128205; ул. Гагарина, 88</span>
                  </div>
                  <div class="trip-stats">
                    <span>&#128207; 22 км</span>
                    <span>&#9201;&#65039; 1ч 15мин</span>
                    <span>&#9981; 3.5 л</span>
                  </div>
                </div>
                <div class="trip-footer">
                  <span class="trip-total">Итого: 450 &#8381;</span>
                  <div class="trip-actions">
                    <button class="btn btn-outline btn-sm">Чек</button>
                    <button class="btn btn-outline btn-sm">Оценить</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Платежи -->
          <section id="payments" v-show="activeSection === 'payments'" class="account-section">
            <h1>Платежи</h1>

            <div class="payment-methods">
              <h2>Способы оплаты</h2>
              <div class="cards-list">
                <div class="payment-card active">
                  <div class="card-logo">VISA</div>
                  <div class="card-number">&#8226;&#8226;&#8226;&#8226; 4242</div>
                  <div class="card-actions">
                    <button class="btn btn-outline btn-sm">Основная</button>
                    <button class="btn btn-outline btn-sm">Удалить</button>
                  </div>
                </div>
                <div class="payment-card">
                  <div class="card-logo">MC</div>
                  <div class="card-number">&#8226;&#8226;&#8226;&#8226; 8899</div>
                  <div class="card-actions">
                    <button class="btn btn-outline btn-sm">Основная</button>
                    <button class="btn btn-outline btn-sm">Удалить</button>
                  </div>
                </div>
                <button class="add-card-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Добавить карту
                </button>
              </div>
            </div>

            <div class="payment-history">
              <h2>История платежей</h2>
              <table class="payment-table">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Описание</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>12.03.2026</td>
                    <td>Поездка Tesla Model 3</td>
                    <td>-750 &#8381;</td>
                    <td><span class="status-badge success">Успешно</span></td>
                  </tr>
                  <tr>
                    <td>10.03.2026</td>
                    <td>Поездка BMW 3 Series</td>
                    <td>-450 &#8381;</td>
                    <td><span class="status-badge success">Успешно</span></td>
                  </tr>
                  <tr>
                    <td>08.03.2026</td>
                    <td>Пополнение баланса</td>
                    <td>+1000 &#8381;</td>
                    <td><span class="status-badge success">Успешно</span></td>
                  </tr>
                  <tr>
                    <td>05.03.2026</td>
                    <td>Залоговая сумма</td>
                    <td>-5000 &#8381;</td>
                    <td><span class="status-badge pending">В обработке</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Настройки -->
          <section id="settings" v-show="activeSection === 'settings'" class="account-section">
            <h1>Настройки</h1>

            <div class="settings-form">
              <h2>Личные данные</h2>
              <div class="form-row">
                <div class="form-group">
                  <label>Имя</label>
                  <input type="text" class="form-input" id="profile-name" :value="firstName">
                </div>
                <div class="form-group">
                  <label>Фамилия</label>
                  <input type="text" class="form-input" id="profile-lastname" :value="lastName">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" class="form-input" id="profile-email" :value="user?.email || ''">
                </div>
                <div class="form-group">
                  <label>Телефон</label>
                  <input type="tel" class="form-input" id="profile-phone" :value="user?.phone || ''">
                </div>
              </div>
              <button class="btn btn-primary">Сохранить</button>
            </div>

            <div class="settings-form">
              <h2>Безопасность</h2>
              <div class="form-group">
                <label>Текущий пароль</label>
                <input type="password" class="form-input" placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Новый пароль</label>
                  <input type="password" class="form-input" placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;">
                </div>
                <div class="form-group">
                  <label>Подтверждение пароля</label>
                  <input type="password" class="form-input" placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;">
                </div>
              </div>
              <button class="btn btn-primary">Изменить пароль</button>
            </div>

            <div class="settings-form">
              <h2>Уведомления</h2>
              <div class="toggle-group">
                <label class="toggle">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                  <span class="toggle-label">Email уведомления о поездках</span>
                </label>
                <label class="toggle">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                  <span class="toggle-label">SMS уведомления</span>
                </label>
                <label class="toggle">
                  <input type="checkbox">
                  <span class="toggle-slider"></span>
                  <span class="toggle-label">Маркетинговые рассылки</span>
                </label>
              </div>
            </div>

            <div class="danger-zone">
              <h2>Удалить аккаунт</h2>
              <p>Удаление аккаунта необратимо. Все ваши данные будут удалены.</p>
              <button class="btn btn-danger">Удалить аккаунт</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useApi'
import { useAuthStore } from '../composables/useAuthStore'

const router = useRouter()
const { getMe } = useAuth()
const { user, isAdmin, clearAuth } = useAuthStore()

const activeSection = ref('overview')

const menuItems = [
  {
    id: 'overview',
    label: 'Обзор',
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/><circle cx="10" cy="8" r="2"/><path d="M10 12c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'
  },
  {
    id: 'history',
    label: 'История поездок',
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/></svg>'
  },
  {
    id: 'payments',
    label: 'Платежи',
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v4H4v-4z"/></svg>'
  },
  {
    id: 'settings',
    label: 'Настройки',
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 8a2 2 0 100-4 2 2 0 000 4zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-8c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/></svg>'
  }
]

const displayName = computed(() => user.value?.name || 'Пользователь')
const avatarLetter = computed(() => (user.value?.name || 'П')[0].toUpperCase())
const firstName = computed(() => {
  const parts = (user.value?.name || '').split(' ')
  return parts[0] || ''
})
const lastName = computed(() => {
  const parts = (user.value?.name || '').split(' ')
  return parts.slice(1).join(' ') || ''
})

function handleLogout() {
  if (!confirm('Вы действительно хотите выйти?')) return
  clearAuth()
  router.push('/')
}

onMounted(async () => {
  if (!localStorage.getItem('authToken')) {
    router.push('/login')
    return
  }
  try {
    const data = await getMe()
    if (data && !data.error) {
      // useAuthStore уже обновится через localStorage
    }
  } catch (e) {
    console.error('Ошибка загрузки профиля:', e)
  }
})
</script>
