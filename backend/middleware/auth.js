const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    // Получение токена из заголовка Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Токен авторизации не предоставлен'
      });
    }

    // Формат: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Токен не найден'
      });
    }

    // Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Добавляем данные пользователя в запрос
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Неверный токен'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Срок действия токена истек'
      });
    }

    console.error('Ошибка аутентификации:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка аутентификации'
    });
  }
}

module.exports = authMiddleware;
