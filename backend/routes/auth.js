const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Валидация для регистрации
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Введите корректный email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен содержать минимум 6 символов'),
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Имя должно содержать минимум 2 символа'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Введите корректный номер телефона')
];

// Валидация для входа
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Введите корректный email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Введите пароль')
];

// Регистрация
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password, name, phone } = req.body;

    // Проверка, существует ли пользователь
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует'
      });
    }

    // Создание пользователя
    const user = await User.create({ email, password, name, phone });

    // Генерация токена
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'Регистрация успешна',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при регистрации'
    });
  }
});

// Вход
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Поиск пользователя
    const user = User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Неверный email или пароль'
      });
    }

    // Проверка пароля
    const isValidPassword = await User.validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Неверный email или пароль'
      });
    }

    // Генерация токена
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Вход успешен',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при входе'
    });
  }
});

// Получение текущего пользователя
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    res.json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении данных пользователя'
    });
  }
});

// Выход (на клиенте нужно удалить токен)
router.post('/logout', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Выход успешен'
  });
});

module.exports = router;
