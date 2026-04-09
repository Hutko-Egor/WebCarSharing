const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'data', 'database.sqlite');

async function initDB() {
  const SQL = await initSqlJs();



  const db = new SQL.Database();

  // Создаём таблицу users
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

  // Создаём таблицу cars
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



  // Создаём таблицу favorites
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



  // Создаём тестового пользователя
  const hashedPassword = await bcrypt.hash('123456', 10);
  db.run(`
    INSERT INTO users (email, password, name, phone, role)
    VALUES (?, ?, ?, ?, ?)
  `, ['test@example.com', hashedPassword, 'Тестовый Пользователь', '+7 (999) 000-00-00', 'user']);

  // Создаём администратора
  const adminHashedPassword = await bcrypt.hash('admin123', 10);
  db.run(`
    INSERT INTO users (email, password, name, phone, role)
    VALUES (?, ?, ?, ?, ?)
  `, ['admin@carsharing.ru', adminHashedPassword, 'Администратор', '+7 (999) 000-00-01', 'admin']);

  // Создаём тестовые автомобили
  db.run(`INSERT INTO cars (model, brand, year, color, license_plate, car_type, transmission, seats, image_url, tariff_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['Polo', 'Volkswagen', 2022, 'Белый', 'А001АА777', 'Седан', 'Автомат', 5, 'images/vw-polo.png', 1, 'available']);
  db.run(`INSERT INTO cars (model, brand, year, color, license_plate, car_type, transmission, seats, image_url, tariff_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['3 Series', 'BMW', 2023, 'Чёрный', 'А002АА777', 'Седан', 'Автомат', 5, 'images/bmw.png', 2, 'available']);
  db.run(`INSERT INTO cars (model, brand, year, color, license_plate, car_type, transmission, seats, image_url, tariff_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['Model 3', 'Tesla', 2024, 'Красный', 'А003АА777', 'Седан', 'Автомат', 5, 'images/tesla.png', 4, 'available']);
  db.run(`INSERT INTO cars (model, brand, year, color, license_plate, car_type, transmission, seats, image_url, tariff_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['Camry', 'Toyota', 2023, 'Серебристый', 'А004АА777', 'Седан', 'Автомат', 5, 'images/toyota-camry.png', 2, 'available']);
  db.run(`INSERT INTO cars (model, brand, year, color, license_plate, car_type, transmission, seats, image_url, tariff_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['E-Class', 'Mercedes-Benz', 2024, 'Чёрный', 'А005АА777', 'Седан', 'Автомат', 5, 'images/mercedes.png', 3, 'available']);
  db.run(`INSERT INTO cars (model, brand, year, color, license_plate, car_type, transmission, seats, image_url, tariff_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['Leaf', 'Nissan', 2023, 'Синий', 'А006АА777', 'Хэтчбек', 'Автомат', 5, 'images/nissan-leaf.png', 1, 'available']);
  console.log('Автомобили созданы');

  // Сохраняем БД
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);

  console.log(`База данных сохранена в ${DB_PATH}`);

  db.close();
  console.log('Готово!');
}

initDB().catch(console.error);
