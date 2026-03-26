// Конфигурация API
const API_URL = 'http://localhost:3000/api';

// Auth API
const authAPI = {
  // Регистрация
  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return await response.json();
  },

  // Вход
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    return await response.json();
  },

  // Получение данных текущего пользователя
  async getMe(token) {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  },

  // Выход
  async logout(token) {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  }
};

// Управление токеном в localStorage
const tokenManager = {
  setToken(token) {
    localStorage.setItem('authToken', token);
  },

  getToken() {
    return localStorage.getItem('authToken');
  },

  removeToken() {
    localStorage.removeItem('authToken');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

// Управление данными пользователя
const userManager = {
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  removeUser() {
    localStorage.removeItem('user');
  }
};

// Вспомогательные функции
const authHelpers = {
  // Сохранение данных после входа/регистрации
  saveAuthData(token, user) {
    tokenManager.setToken(token);
    userManager.setUser(user);
  },

  // Очистка данных при выходе
  clearAuthData() {
    tokenManager.removeToken();
    userManager.removeUser();
  },

  // Перенаправление на страницу входа
  redirectToLogin() {
    window.location.href = 'login.html';
  },

  // Перенаправление на главную
  redirectToHome() {
    window.location.href = 'index.html';
  },

  // Проверка авторизации
  checkAuth() {
    return tokenManager.isAuthenticated();
  },

  // Требовать авторизацию
  requireAuth() {
    if (!this.checkAuth()) {
      this.redirectToLogin();
      return false;
    }
    return true;
  }
};

// Обновление UI в зависимости от статуса авторизации
function updateAuthUI() {
  const user = userManager.getUser();
  const loginLinks = document.querySelectorAll('.auth-logged-out');
  const loggedLinks = document.querySelectorAll('.auth-logged-in');
  const userNameElements = document.querySelectorAll('.user-name');

  if (user) {
    loginLinks.forEach(el => el.style.display = 'none');
    loggedLinks.forEach(el => el.style.display = 'block');
    userNameElements.forEach(el => el.textContent = user.name);
  } else {
    loginLinks.forEach(el => el.style.display = 'block');
    loggedLinks.forEach(el => el.style.display = 'none');
  }
}

// Обработка выхода
async function handleLogout() {
  const token = tokenManager.getToken();
  if (token) {
    try {
      await authAPI.logout(token);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  }
  authHelpers.clearAuthData();
  authHelpers.redirectToHome();
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    API_URL,
    authAPI,
    tokenManager,
    userManager,
    authHelpers,
    updateAuthUI,
    handleLogout
  };
}
