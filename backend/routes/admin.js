const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Все маршруты требуют авторизации и прав администратора
router.use(authMiddleware);
router.use(adminMiddleware);

// Валидация для создания/обновления пользователя
const createUserValidation = [
  body('email')
    .isEmail()
    .withMessage('Неверный формат email')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Пароль должен быть не менее 8 символов'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Имя обязательно'),
  body('phone')
    .optional()
    .trim(),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Неверная роль')
];

// Получить статистику для админ-панели
router.get('/stats', (req, res) => {
  try {
    const allUsers = User.findAll();
    const allCars = Car.findAll();
    const allBookings = Booking.findAll();

    const stats = {
      totalUsers: allUsers.length,
      totalCars: allCars.length,
      totalBookings: allBookings.length,
      revenue: allBookings
        .filter(b => b.status === 'completed' && b.totalPrice)
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
      usersByRole: {
        users: allUsers.filter(u => u.role === 'user').length,
        admins: allUsers.filter(u => u.role === 'admin').length
      },
      carsByStatus: {
        available: allCars.filter(c => c.status === 'available').length,
        booked: allCars.filter(c => c.status === 'booked').length,
        inUse: allCars.filter(c => c.status === 'in_use').length,
        maintenance: allCars.filter(c => c.status === 'maintenance').length
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении статистики'
    });
  }
});

// Получить всех пользователей
router.get('/users', (req, res) => {
  try {
    const { role, status } = req.query;

    let users = User.findAll();

    // Фильтрация по роли
    if (role) {
      users = users.filter(u => u.role === role);
    }

    // Форматируем данные (убираем пароли)
    const usersData = users.map(u => u.toJSON());

    res.json({
      success: true,
      data: usersData
    });
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка пользователей'
    });
  }
});

// Получить пользователя по ID
router.get('/users/:id', (req, res) => {
  try {
    const user = User.findById(parseInt(req.params.id));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    res.json({
      success: true,
      data: user.toJSON()
    });
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении пользователя'
    });
  }
});

// Создать пользователя
router.post('/users', createUserValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password, name, phone, role } = req.body;

    // Проверяем, существует ли пользователь с таким email
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует'
      });
    }

    const user = await User.create({
      email,
      password: password || 'defaultPassword123',
      name,
      phone,
      role
    });

    res.status(201).json({
      success: true,
      data: user.toJSON()
    });
  } catch (error) {
    console.error('Ошибка создания пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании пользователя'
    });
  }
});

// Обновить пользователя
router.put('/users/:id', createUserValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = parseInt(req.params.id);
    const { email, password, name, phone, role } = req.body;

    const user = User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    // Если меняем email, проверяем на занятость
    if (email && email !== user.email) {
      const existingUser = User.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          success: false,
          message: 'Пользователь с таким email уже существует'
        });
      }
    }

    const updateData = { name, phone, email };
    if (password) {
      updateData.password = password;
    }
    if (role) {
      updateData.role = role;
    }

    const updatedUser = User.update(userId, updateData);

    res.json({
      success: true,
      data: updatedUser.toJSON()
    });
  } catch (error) {
    console.error('Ошибка обновления пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении пользователя'
    });
  }
});

// Удалить пользователя
router.delete('/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Нельзя удалить самого себя
    if (userId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Нельзя удалить самого себя'
      });
    }

    const user = User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    User.remove(userId);

    res.json({
      success: true,
      message: 'Пользователь удалён'
    });
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении пользователя'
    });
  }
});

// Получить все автомобили
router.get('/cars', (req, res) => {
  try {
    const cars = Car.findAll();
    const Tariff = require('../models/Tariff');

    const carsWithTariff = cars.map(car => {
      const tariff = Tariff.findById(car.tariffId);
      return {
        ...car.toJSON(),
        tariff: tariff ? tariff.toJSON() : null
      };
    });

    res.json({
      success: true,
      data: carsWithTariff
    });
  } catch (error) {
    console.error('Ошибка получения автомобилей:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка автомобилей'
    });
  }
});

// Удалить автомобиль
router.delete('/cars/:id', (req, res) => {
  try {
    const carId = parseInt(req.params.id);

    const car = Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Автомобиль не найден'
      });
    }

    Car.remove(carId);

    res.json({
      success: true,
      message: 'Автомобиль удалён'
    });
  } catch (error) {
    console.error('Ошибка удаления автомобиля:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении автомобиля'
    });
  }
});

// Получить все бронирования
router.get('/bookings', (req, res) => {
  try {
    const bookings = Booking.findAll();
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Ошибка получения бронирований:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка бронирований'
    });
  }
});

module.exports = router;
