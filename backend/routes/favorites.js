const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Favorite = require('../models/Favorite');
const Car = require('../models/Car');
const Tariff = require('../models/Tariff');
const authMiddleware = require('../middleware/auth');

// Валидация
const toggleFavoriteValidation = [
  body('carId')
    .isInt({ min: 1 })
    .withMessage('Неверный ID автомобиля')
];

// Получить избранные автомобили текущего пользователя
router.get('/', authMiddleware, (req, res) => {
  try {
    const favorites = Favorite.findByUserId(req.user.userId);
    
    // Получаем информацию об автомобилях
    const carsWithTariff = favorites.map(fav => {
      const car = Car.findById(fav.carId);
      if (!car) return null;
      
      const tariff = Tariff.findById(car.tariffId);
      return {
        ...car.toJSON(),
        tariff: tariff ? tariff.toJSON() : null,
        favoriteId: fav.id
      };
    }).filter(Boolean); // Убираем null (если автомобиль был удалён)

    res.json({
      success: true,
      data: carsWithTariff
    });
  } catch (error) {
    console.error('Ошибка получения избранных:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка избранных'
    });
  }
});

// Добавить/удалить из избранного
router.post('/toggle', authMiddleware, toggleFavoriteValidation, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { carId } = req.body;
    
    // Проверка существования автомобиля
    const car = Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Автомобиль не найден'
      });
    }

    const result = Favorite.toggle(req.user.userId, carId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Ошибка переключения избранного:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при переключении избранного'
    });
  }
});

// Удалить из избранного
router.delete('/:carId', authMiddleware, (req, res) => {
  try {
    const carId = parseInt(req.params.carId);
    
    // Проверка существования автомобиля
    const car = Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Автомобиль не найден'
      });
    }

    Favorite.remove(req.user.userId, carId);

    res.json({
      success: true,
      message: 'Удалено из избранного'
    });
  } catch (error) {
    console.error('Ошибка удаления из избранного:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении из избранного'
    });
  }
});

module.exports = router;
