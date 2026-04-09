<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <router-link to="/" class="admin-logo">CAR<span>SHARING</span></router-link>

      <ul class="admin-nav">
        <li>
          <a
            href="#"
            :class="{ active: activeSection === 'dashboard' }"
            @click.prevent="activeSection = 'dashboard'"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Главная
          </a>
        </li>
        <li>
          <a
            href="#"
            :class="{ active: activeSection === 'users' }"
            @click.prevent="activeSection = 'users'"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            Пользователи
          </a>
        </li>
        <li>
          <a href="#">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
            </svg>
            Автомобили
          </a>
        </li>
        <li>
          <a href="#">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
            Бронирования
          </a>
        </li>
        <li>
          <a href="#">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Финансы
          </a>
        </li>
      </ul>

      <div class="admin-nav-section">
        <p class="admin-nav-section-title">Настройки</p>
        <ul class="admin-nav">
          <li>
            <a href="#">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Параметры
            </a>
          </li>
        </ul>
      </div>

      <div class="admin-user">
        <div class="admin-user-avatar">{{ avatarLetter }}</div>
        <div class="admin-user-info">
          <p class="admin-user-name">{{ user?.name || 'Admin' }}</p>
          <p class="admin-user-role">Администратор</p>
        </div>
      </div>
    </aside>

    <main class="admin-main">
      <header class="admin-header">
        <div class="admin-header-center">
          <input type="text" class="admin-search" placeholder="Поиск...">
        </div>
      </header>

      <div class="admin-content">
        <!-- Главная / Статистика -->
        <div v-show="activeSection === 'dashboard'">
          <div class="admin-stats">
            <div class="stat-card">
              <div class="stat-card-header">
                <div>
                  <p class="stat-card-value">{{ stats.carsCount || '0' }}</p>
                  <p class="stat-card-label">Автомобилей</p>
                </div>
                <div class="stat-card-icon green">&#128663;</div>
              </div>
              <p class="stat-card-change">+12% за месяц</p>
            </div>

            <div class="stat-card">
              <div class="stat-card-header">
                <div>
                  <p class="stat-card-value">{{ stats.usersCount || '0' }}</p>
                  <p class="stat-card-label">Клиентов</p>
                </div>
                <div class="stat-card-icon blue">&#128101;</div>
              </div>
              <p class="stat-card-change">+8% за месяц</p>
            </div>

            <div class="stat-card">
              <div class="stat-card-header">
                <div>
                  <p class="stat-card-value">{{ stats.bookingsCount || '0' }}</p>
                  <p class="stat-card-label">Бронирований</p>
                </div>
                <div class="stat-card-icon orange">&#128197;</div>
              </div>
              <p class="stat-card-change negative">-3% за месяц</p>
            </div>

            <div class="stat-card">
              <div class="stat-card-header">
                <div>
                  <p class="stat-card-value">{{ stats.revenue || '0' }} &#8381;</p>
                  <p class="stat-card-label">Выручка</p>
                </div>
                <div class="stat-card-icon purple">&#128176;</div>
              </div>
              <p class="stat-card-change">+25% за месяц</p>
            </div>
          </div>

          <div class="admin-table-container">
            <div class="admin-table-header">
              <h2>Последние пользователи</h2>
              <button class="action-btn edit" @click="activeSection = 'users'">Показать всех</button>
            </div>

            <table class="admin-table">
              <thead>
                <tr>
                  <th>Пользователь</th>
                  <th>Email</th>
                  <th>Дата регистрации</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in recentUsers" :key="u.id">
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar">{{ (u.name || 'U')[0].toUpperCase() }}</div>
                      <span>{{ u.name || 'Пользователь' }}</span>
                    </div>
                  </td>
                  <td>{{ u.email || '-' }}</td>
                  <td>{{ formatDate(u.createdAt) }}</td>
                  <td>
                    <span class="status-badge" :class="u.status || 'active'">
                      {{ statusLabel(u.status) }}
                    </span>
                  </td>
                  <td>
                    <button class="action-btn edit">Ред.</button>
                    <button class="action-btn delete" @click="deleteUser(u.id)">Удалить</button>
                  </td>
                </tr>
                <tr v-if="recentUsers.length === 0">
                  <td colspan="5" style="text-align: center; color: #666;">Нет данных</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Пользователи -->
        <div v-show="activeSection === 'users'">
          <div class="admin-table-container">
            <div class="admin-table-header">
              <h2>Все пользователи</h2>
            </div>

            <table class="admin-table">
              <thead>
                <tr>
                  <th>Пользователь</th>
                  <th>Email</th>
                  <th>Телефон</th>
                  <th>Роль</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in users" :key="u.id">
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar">{{ (u.name || 'U')[0].toUpperCase() }}</div>
                      <span>{{ u.name || 'Пользователь' }}</span>
                    </div>
                  </td>
                  <td>{{ u.email || '-' }}</td>
                  <td>{{ u.phone || '-' }}</td>
                  <td>{{ u.role || 'user' }}</td>
                  <td>
                    <span class="status-badge" :class="u.status || 'active'">
                      {{ statusLabel(u.status) }}
                    </span>
                  </td>
                  <td>
                    <button class="action-btn edit">Ред.</button>
                    <button class="action-btn delete" @click="deleteUser(u.id)">Удалить</button>
                  </td>
                </tr>
                <tr v-if="users.length === 0">
                  <td colspan="6" style="text-align: center; color: #666;">Нет данных</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth, useAdmin } from '../composables/useApi'
import { useAuthStore } from '../composables/useAuthStore'

const router = useRouter()
const { getMe } = useAuth()
const { getStats, getUsers, deleteUser: apiDeleteUser } = useAdmin()
const { user, isAdmin, clearAuth } = useAuthStore()

const activeSection = ref('dashboard')
const stats = ref({})
const users = ref([])

const avatarLetter = computed(() => (user.value?.name || 'A')[0].toUpperCase())

const recentUsers = computed(() => users.value.slice(0, 4))

function statusLabel(status) {
  const map = { active: 'Активен', pending: 'Ожидание', inactive: 'Неактивен' }
  return map[status] || 'Активен'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function deleteUser(userId) {
  if (!confirm('Удалить пользователя?')) return
  try {
    await apiDeleteUser(userId)
    users.value = users.value.filter(u => u.id !== userId)
  } catch (e) {
    console.error('Ошибка удаления:', e)
  }
}

function handleLogout() {
  if (!confirm('Вы действительно хотите выйти?')) return
  clearAuth()
  router.push('/')
}

onMounted(async () => {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
  if (storedUser?.role !== 'admin') {
    router.push('/')
    return
  }

  try {
    const [statsData, usersData] = await Promise.all([
      getStats(),
      getUsers()
    ])
    if (statsData) stats.value = statsData
    if (Array.isArray(usersData)) users.value = usersData
  } catch (e) {
    console.error('Ошибка загрузки данных админки:', e)
  }
})
</script>
