const User = require('../models/User');

// Middleware для проверки прав администратора
function adminMiddleware(req, res, next) {
  try {
    // Проверяем, что пользователь аутентифицирован
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }

    // Получаем пользователя из БД
    const user = User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    // Проверяем роль администратора
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещён. Требуются права администратора'
      });
    }

    // Добавляем информацию о роли в запрос
    req.userRole = user.role;

    next();
  } catch (error) {
    console.error('Ошибка проверки прав администратора:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка проверки прав доступа'
    });
  }
}

module.exports = adminMiddleware;
