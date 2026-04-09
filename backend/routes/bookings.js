const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Tariff = require('../models/Tariff');
const authMiddleware = require('../middleware/auth');

// Валидация для создания бронирования
const createBookingValidation = [
  body('carId')
    .isInt({ min: 1 })
    .withMessage('Неверный ID автомобиля'),
  body('startTime')
    .isISO8601()
    .withMessage('Неверный формат времени начала'),
  body('endTime')
    .isISO8601()
    .withMessage('Неверный формат времени окончания')
];

// Получить все бронирования текущего пользователя
router.get('/my', authMiddleware, (req, res) => {
  try {
    const { status } = req.query;
    const options = { userId: req.user.userId };
    if (status) options.status = status;

    const bookings = Booking.findAll(options);

    // Добавляем информацию об автомобиле к каждому бронированию
    const bookingsWithCar = bookings.map(booking => {
      const car = Car.findById(booking.carId);
      return {
        ...booking.toJSON(),
        car: car ? car.toJSON() : null
      };
    });

    res.json({
      success: true,
      data: bookingsWithCar
    });
  } catch (error) {
    console.error('Ошибка получения бронирований:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка бронирований'
    });
  }
});

// Получить все бронирования (только для администратора)
router.get('/', authMiddleware, (req, res) => {
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

    const { status, userId, carId } = req.query;
    const options = {};
    if (status) options.status = status;
    if (userId) options.userId = parseInt(userId);
    if (carId) options.carId = parseInt(carId);

    const bookings = Booking.findAll(options);

    const bookingsWithDetails = bookings.map(booking => {
      const car = Car.findById(booking.carId);
      return {
        ...booking.toJSON(),
        car: car ? car.toJSON() : null
      };
    });

    res.json({
      success: true,
      data: bookingsWithDetails
    });
  } catch (error) {
    console.error('Ошибка получения бронирований:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка бронирований'
    });
  }
});

// Получить бронирование по ID
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const booking = Booking.findById(parseInt(req.params.id));

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Бронирование не найдено'
      });
    }

    // Проверка прав: пользователь может видеть только свои бронирования
    const User = require('../models/User');
    const user = User.findById(req.user.userId);
    if (user.role !== 'admin' && booking.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещён'
      });
    }

    const car = Car.findById(booking.carId);

    res.json({
      success: true,
      data: {
        ...booking.toJSON(),
        car: car ? car.toJSON() : null
      }
    });
  } catch (error) {
    console.error('Ошибка получения бронирования:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении бронирования'
    });
  }
});

// Создать бронирование
router.post('/', authMiddleware, createBookingValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { carId, startTime, endTime } = req.body;

    // Проверка существования автомобиля
    const car = Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Автомобиль не найден'
      });
    }

    // Проверка статуса автомобиля
    if (car.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Автомобиль недоступен для бронирования'
      });
    }

    // Проверка времени
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'Время начала должно быть раньше времени окончания'
      });
    }

    // Расчёт стоимости
    const tariff = Tariff.findById(car.tariffId);
    if (!tariff) {
      return res.status(400).json({
        success: false,
        message: 'Тариф не найден'
      });
    }

    const durationMinutes = (end - start) / (1000 * 60);
    const totalPrice = durationMinutes * tariff.pricePerMinute;

    // Создание бронирования
    const booking = Booking.create({
      userId: req.user.userId,
      carId,
      startTime,
      endTime,
      totalPrice,
      status: 'active'
    });

    // Обновление статуса автомобиля
    Car.updateStatus(carId, 'booked');

    res.status(201).json({
      success: true,
      data: {
        ...booking.toJSON(),
        car: car.toJSON(),
        tariff: tariff.toJSON()
      }
    });
  } catch (error) {
    console.error('Ошибка создания бронирования:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании бронирования'
    });
  }
});

// Отменить бронирование
router.post('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const booking = Booking.findById(parseInt(req.params.id));

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Бронирование не найдено'
      });
    }

    // Проверка прав: пользователь может отменить только свои бронирования
    const User = require('../models/User');
    const user = User.findById(req.user.userId);
    if (user.role !== 'admin' && booking.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещён'
      });
    }

    // Отмена бронирования
    Booking.cancel(booking.id);

    // Возврат автомобиля в доступные
    Car.updateStatus(booking.carId, 'available');

    res.json({
      success: true,
      message: 'Бронирование отменено'
    });
  } catch (error) {
    console.error('Ошибка отмены бронирования:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при отмене бронирования'
    });
  }
});

// Завершить бронирование (начать поездку)
router.post('/:id/start', authMiddleware, async (req, res) => {
  try {
    const booking = Booking.findById(parseInt(req.params.id));

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Бронирование не найдено'
      });
    }

    // Проверка прав
    const User = require('../models/User');
    const user = User.findById(req.user.userId);
    if (user.role !== 'admin' && booking.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещён'
      });
    }

    // Обновление статуса бронирования
    Booking.update(booking.id, {
      actualStartTime: new Date().toISOString(),
      status: 'in_use'
    });

    // Обновление статуса автомобиля
    Car.updateStatus(booking.carId, 'in_use');

    res.json({
      success: true,
      message: 'Поездка началась'
    });
  } catch (error) {
    console.error('Ошибка начала поездки:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при начале поездки'
    });
  }
});

// Завершить поездку
router.post('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const booking = Booking.findById(parseInt(req.params.id));

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Бронирование не найдено'
      });
    }

    // Проверка прав
    const User = require('../models/User');
    const user = User.findById(req.user.userId);
    if (user.role !== 'admin' && booking.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещён'
      });
    }

    // Завершение бронирования
    Booking.complete(booking.id, booking.totalPrice);

    // Возврат автомобиля в доступные
    Car.updateStatus(booking.carId, 'available');

    res.json({
      success: true,
      message: 'Поездка завершена',
      totalPrice: booking.totalPrice
    });
  } catch (error) {
    console.error('Ошибка завершения поездки:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при завершении поездки'
    });
  }
});

module.exports = router;
