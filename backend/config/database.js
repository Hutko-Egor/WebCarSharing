const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'database.sqlite');

let db = null;

// Инициализация базы данных
async function initDatabase() {
  const SQL = await initSqlJs();
  
  // Создаём папку для БД если не существует
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Загружаем существующую БД или создаём новую
  try {
    if (fs.existsSync(DB_PATH)) {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
    }
  } catch (error) {
    console.error('Ошибка загрузки БД:', error);
    db = new SQL.Database();
  }
  
  // Создаём таблицы
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tariffs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price_per_minute REAL NOT NULL,
      price_per_hour REAL,
      price_per_day REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model TEXT NOT NULL,
      brand TEXT NOT NULL,
      year INTEGER,
      color TEXT,
      license_plate TEXT UNIQUE,
      car_type TEXT,
      transmission TEXT,
      seats INTEGER,
      image_url TEXT,
      tariff_id INTEGER,
      status TEXT DEFAULT 'available',
      latitude REAL,
      longitude REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tariff_id) REFERENCES tariffs(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      car_id INTEGER NOT NULL,
      start_time DATETIME NOT NULL,
      end_time DATETIME,
      actual_start_time DATETIME,
      actual_end_time DATETIME,
      status TEXT DEFAULT 'active',
      total_price REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (car_id) REFERENCES cars(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      car_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (car_id) REFERENCES cars(id),
      UNIQUE(user_id, car_id)
    )
  `);

  saveDatabase();

  return db;
}

// Сохранение БД в файл
function saveDatabase() {
  if (!db) return;
  
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (error) {
    console.error('Ошибка сохранения БД:', error);
  }
}

// Получить экземпляр БД
function getDatabase() {
  return db;
}

// Закрыть БД
function closeDatabase() {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
  }
}

module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase,
  saveDatabase
};
