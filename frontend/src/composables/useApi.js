const API_URL = 'http://localhost:3000/api'

async function request(url, options = {}) {
  const token = localStorage.getItem('authToken')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers
  })

  return await response.json()
}

// Auth API
export function useAuth() {
  return {
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    getMe: () => request('/auth/me'),
    logout: () => request('/auth/logout', { method: 'POST' }),
  }
}

// Cars API
export function useCars() {
  return {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return request(`/cars${query ? '?' + query : ''}`)
    },
    getAvailable: () => request('/cars/available'),
    getById: (id) => request(`/cars/${id}`),
  }
}

// Favorites API
export function useFavorites() {
  return {
    getFavorites: () => request('/favorites'),
    toggle: (carId) => request('/favorites/toggle', { method: 'POST', body: JSON.stringify({ carId }) }),
    remove: (carId) => request(`/favorites/${carId}`, { method: 'DELETE' }),
  }
}

// Admin API
export function useAdmin() {
  return {
    getStats: () => request('/admin/stats'),
    getUsers: (role = null) => request(role ? `/admin/users?role=${role}` : '/admin/users'),
    getUserById: (userId) => request(`/admin/users/${userId}`),
    createUser: (userData) => request('/admin/users', { method: 'POST', body: JSON.stringify(userData) }),
    updateUser: (userId, userData) => request(`/admin/users/${userId}`, { method: 'PUT', body: JSON.stringify(userData) }),
    deleteUser: (userId) => request(`/admin/users/${userId}`, { method: 'DELETE' }),
    getCars: () => request('/admin/cars'),
    deleteCar: (carId) => request(`/admin/cars/${carId}`, { method: 'DELETE' }),
    getBookings: () => request('/admin/bookings'),
  }
}

export { API_URL }
