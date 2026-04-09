const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Car = require('../models/Car');
const Tariff = require('../models/Tariff');
const authMiddleware = require('../middleware/auth');

// Валидация для создания автомобиля
const createCarValidation = [
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Модель автомобиля обязательна'),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Марка автомобиля обязательна'),
  body('licensePlate')
    .trim()
    .notEmpty()
    .withMessage('Госномер обязателен'),
  body('tariffId')
    .isInt({ min: 1 })
    .withMessage('Неверный ID тарифа'),
  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Неверный год выпуска'),
  body('seats')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Неверное количество мест')
];

// Получить все автомобили
router.get('/', (req, res) => {
  try {
    const { status, tariffId, carType } = req.query;
    
    const options = {};
    if (status) options.status = status;
    if (tariffId) options.tariffId = parseInt(tariffId);
    if (carType) options.carType = carType;

    const cars = Car.findAll(options);
    
    // Добавляем информацию о тарифе к каждому автомобилю
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

// Получить доступные автомобили
router.get('/available', (req, res) => {
  try {
    const cars = Car.findAvailable();
    
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
    console.error('Ошибка получения доступных автомобилей:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка доступных автомобилей'
    });
  }
});

// Получить автомобиль по ID
router.get('/:id', (req, res) => {
  try {
    const car = Car.findById(parseInt(req.params.id));
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Автомобиль не найден'
      });
    }

    const tariff = Tariff.findById(car.tariffId);
    
    res.json({
      success: true,
      data: {
        ...car.toJSON(),
        tariff: tariff ? tariff.toJSON() : null
      }
    });
  } catch (error) {
    console.error('Ошибка получения автомобиля:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении автомобиля'
    });
  }
});

// Создать автомобиль (требуется авторизация администратора)
router.post('/', authMiddleware, createCarValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Проверка прав администратора
    const User = require('../models/User');
    const user = User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещён'
      });
    }

    const car = Car.create(req.body);
    const tariff = Tariff.findById(car.tariffId);

    res.status(201).json({
      success: true,
      data: {
        ...car.toJSON(),
        tariff: tariff ? tariff.toJSON() : null
      }
    });
  } catch (error) {
    console.error('Ошибка создания автомобиля:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании автомобиля'
    });
  }
});

// Обновить автомобиль (требуется авторизация администратора)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Проверка прав администратора
    const User = require('../models/User');
    const user = User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещён'
      });
    }

    const car = Car.update(parseInt(req.params.id), req.body);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Автомобиль не найден'
      });
    }

    const tariff = Tariff.findById(car.tariffId);

    res.json({
      success: true,
      data: {
        ...car.toJSON(),
        tariff: tariff ? tariff.toJSON() : null
      }
    });
  } catch (error) {
    console.error('Ошибка обновления автомобиля:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении автомобиля'
    });
  }
});

// Удалить автомобиль (требуется авторизация администратора)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Проверка прав администратора
    const User = require('../models/User');
    const user = User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещён'
      });
    }

    const success = Car.remove(parseInt(req.params.id));
    
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

module.exports = router;
