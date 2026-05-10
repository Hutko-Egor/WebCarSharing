require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const carsRoutes = require('./routes/cars');

dotenv.config();

const { initDatabase, closeDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');
const bookingsRoutes = require('./routes/bookings');
const tariffsRoutes = require('./routes/tariffs');
const favoritesRoutes = require('./routes/favorites');
const adminRoutes = require('./routes/admin');

const app = express();
// Если фронтенд ищет сервер на 5000, а тут 3000 — будет ECONNREFUSED
const PORT = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API маршруты
app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/tariffs', tariffsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Сервер работает' });
});

// Раздача статики
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка при запуске сервера:', error);
    process.exit(1);
  }
}

process.on('SIGINT', () => { closeDatabase(); process.exit(0); });
process.on('SIGTERM', () => { closeDatabase(); process.exit(0); });

startServer();