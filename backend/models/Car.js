const { getDatabase, saveDatabase } = require('../config/database');

class Car {
  constructor(data) {
    this.id = data.id;
    this.model = data.model;
    this.brand = data.brand;
    this.year = data.year;
    this.color = data.color;
    this.licensePlate = data.license_plate;
    this.carType = data.car_type;
    this.transmission = data.transmission;
    this.seats = data.seats;
    this.imageUrl = data.image_url;
    this.tariffId = data.tariff_id;
    this.status = data.status;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.createdAt = data.created_at || data.createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      model: this.model,
      brand: this.brand,
      year: this.year,
      color: this.color,
      licensePlate: this.licensePlate,
      carType: this.carType,
      transmission: this.transmission,
      seats: this.seats,
      imageUrl: this.imageUrl,
      tariffId: this.tariffId,
      status: this.status,
      latitude: this.latitude,
      longitude: this.longitude,
      createdAt: this.createdAt
    };
  }

  // Получить полное название автомобиля
  get fullName() {
    return `${this.brand} ${this.model}`;
  }
}

// Получить все автомобили
function findAll(options = {}) {
  const db = getDatabase();
  if (!db) return [];

  let query = 'SELECT * FROM cars';
  const params = [];
  const conditions = [];

  if (options.status) {
    conditions.push('status = ?');
    params.push(options.status);
  }

  if (options.tariffId) {
    conditions.push('tariff_id = ?');
    params.push(options.tariffId);
  }

  if (options.carType) {
    conditions.push('car_type = ?');
    params.push(options.carType);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY brand, model';

  const stmt = db.prepare(query);
  if (params.length > 0) {
    stmt.bind(params);
  }

  const cars = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    cars.push(new Car(row));
  }

  stmt.free();
  return cars;
}

// Найти автомобиль по ID
function findById(id) {
  const db = getDatabase();
  if (!db) return null;

  const stmt = db.prepare('SELECT * FROM cars WHERE id = ?');
  stmt.bind([id]);

  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return new Car(row);
  }

  stmt.free();
  return null;
}

// Найти автомобиль по госномеру
function findByLicensePlate(licensePlate) {
  const db = getDatabase();
  if (!db) return null;

  const stmt = db.prepare('SELECT * FROM cars WHERE license_plate = ?');
  stmt.bind([licensePlate]);

  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return new Car(row);
  }

  stmt.free();
  return null;
}

// Создать автомобиль
function create(carData) {
  const db = getDatabase();
  if (!db) throw new Error('База данных не инициализирована');

  db.run(
    `INSERT INTO cars (model, brand, year, color, license_plate, car_type, transmission, seats, image_url, tariff_id, status, latitude, longitude) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      carData.model,
      carData.brand,
      carData.year,
      carData.color,
      carData.licensePlate,
      carData.carType,
      carData.transmission,
      carData.seats,
      carData.imageUrl,
      carData.tariffId,
      carData.status || 'available',
      carData.latitude,
      carData.longitude
    ]
  );

  saveDatabase();

  const stmt = db.prepare('SELECT * FROM cars WHERE id = last_insert_rowid()');
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return new Car(row);
  }

  stmt.free();
  throw new Error('Не удалось создать автомобиль');
}

// Обновить автомобиль
function update(id, carData) {
  const db = getDatabase();
  if (!db) return null;

  const fields = [];
  const values = [];

  const fieldMappings = {
    model: 'model',
    brand: 'brand',
    year: 'year',
    color: 'color',
    licensePlate: 'license_plate',
    carType: 'car_type',
    transmission: 'transmission',
    seats: 'seats',
    imageUrl: 'image_url',
    tariffId: 'tariff_id',
    status: 'status',
    latitude: 'latitude',
    longitude: 'longitude'
  };

  for (const [key, column] of Object.entries(fieldMappings)) {
    if (carData[key] !== undefined) {
      fields.push(`${column} = ?`);
      values.push(carData[key]);
    }
  }

  if (fields.length === 0) return findById(id);

  values.push(id);

  db.run(
    `UPDATE cars SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  saveDatabase();
  return findById(id);
}

// Сортировка автомобилей 
// async function sort(transmission, tariff){
//   const db = getDatabase();
//   if (!db) return false;

//   db.run ('SELECT * FROM cars WHERE transmission = ?');
//   db.run ('SELECT * FROM cars WHERE tariff = ?');
//   db.run ('SELECT * FROM cars WHERE ');
//   db.run ('SELECT * FROM cars WHERE ');
//   saveDatabase();
// }

// Удалить автомобиль
function remove(id) {
  const db = getDatabase();
  if (!db) return false;

  db.run('DELETE FROM cars WHERE id = ?', [id]);
  saveDatabase();
  return true;
}

// Обновить статус автомобиля
function updateStatus(id, status) {
  const db = getDatabase();
  if (!db) return null;

  const validStatuses = ['available', 'booked', 'in_use', 'maintenance'];
  if (!validStatuses.includes(status)) {
    throw new Error('Неверный статус автомобиля');
  }

  db.run('UPDATE cars SET status = ? WHERE id = ?', [status, id]);
  saveDatabase();
  return findById(id);
}

// Получить доступные автомобили
function findAvailable() {
  return findAll({ status: 'available' });
}

module.exports = {
  Car,
  findAll,
  findById,
  findByLicensePlate,
  create,
  update,
  remove,
  updateStatus,
  findAvailable
};
