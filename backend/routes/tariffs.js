const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Tariff = require('../models/Tariff');
const authMiddleware = require('../middleware/auth');

// Валидация для создания тарифа
const createTariffValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Название тарифа обязательно'),
  body('pricePerMinute')
    .isFloat({ min: 0 })
    .withMessage('Цена за минуту должна быть положительным числом')
];

// Получить все тарифы
router.get('/', (req, res) => {
  try {
    const tariffs = Tariff.findAll();
    
    res.json({
      success: true,
      data: tariffs.map(t => t.toJSON())
    });
  } catch (error) {
    console.error('Ошибка получения тарифов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка тарифов'
    });
  }
});

// Получить тариф по ID
router.get('/:id', (req, res) => {
  try {
    const tariff = Tariff.findById(parseInt(req.params.id));
    
    if (!tariff) {
      return res.status(404).json({
        success: false,
        message: 'Тариф не найден'
      });
    }

    res.json({
      success: true,
      data: tariff.toJSON()
    });
  } catch (error) {
    console.error('Ошибка получения тарифа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении тарифа'
    });
  }
});

// Создать тариф (требуется авторизация администратора)
router.post('/', authMiddleware, createTariffValidation, async (req, res) => {
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

    const tariff = Tariff.create(req.body);

    res.status(201).json({
      success: true,
      data: tariff.toJSON()
    });
  } catch (error) {
    console.error('Ошибка создания тарифа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании тарифа'
    });
  }
});

// Обновить тариф (требуется авторизация администратора)
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

    const tariff = Tariff.update(parseInt(req.params.id), req.body);
    
    if (!tariff) {
      return res.status(404).json({
        success: false,
        message: 'Тариф не найден'
      });
    }

    res.json({
      success: true,
      data: tariff.toJSON()
    });
  } catch (error) {
    console.error('Ошибка обновления тарифа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении тарифа'
    });
  }
});

// Удалить тариф (требуется авторизация администратора)
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

    const success = Tariff.remove(parseInt(req.params.id));
    
    res.json({
      success: true,
      message: 'Тариф удалён'
    });
  } catch (error) {
    console.error('Ошибка удаления тарифа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении тарифа'
    });
  }
});

module.exports = router;
