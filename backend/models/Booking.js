const { getDatabase, saveDatabase } = require('../config/database');

class Booking {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.carId = data.car_id;
    this.startTime = data.start_time;
    this.endTime = data.end_time;
    this.actualStartTime = data.actual_start_time;
    this.actualEndTime = data.actual_end_time;
    this.status = data.status;
    this.totalPrice = data.total_price;
    this.createdAt = data.created_at || data.createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      carId: this.carId,
      startTime: this.startTime,
      endTime: this.endTime,
      actualStartTime: this.actualStartTime,
      actualEndTime: this.actualEndTime,
      status: this.status,
      totalPrice: this.totalPrice,
      createdAt: this.createdAt
    };
  }
}

// Получить все бронирования
function findAll() {
  const db = getDatabase();
  if (!db) return [];

  const stmt = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC');
  stmt.bind();

  const bookings = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    bookings.push(new Booking(row));
  }

  stmt.free();
  return bookings;
}

// Найти бронирование по ID
function findById(id) {
  const db = getDatabase();
  if (!db) return null;

  const stmt = db.prepare('SELECT * FROM bookings WHERE id = ?');
  stmt.bind([id]);

  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return new Booking(row);
  }

  stmt.free();
  return null;
}

// Получить бронирования пользователя
function findByUserId(userId) {
  const db = getDatabase();
  if (!db) return [];

  const stmt = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC');
  stmt.bind([userId]);

  const bookings = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    bookings.push(new Booking(row));
  }

  stmt.free();
  return bookings;
}

// Получить бронирования автомобиля
function findByCarId(carId) {
  const db = getDatabase();
  if (!db) return [];

  const stmt = db.prepare('SELECT * FROM bookings WHERE car_id = ? ORDER BY start_time DESC');
  stmt.bind([carId]);

  const bookings = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    bookings.push(new Booking(row));
  }

  stmt.free();
  return bookings;
}

// Создать бронирование
function create(bookingData) {
  const db = getDatabase();
  if (!db) throw new Error('База данных не инициализирована');

  db.run(
    `INSERT INTO bookings (user_id, car_id, start_time, end_time, status)
     VALUES (?, ?, ?, ?, ?)`,
    [
      bookingData.userId,
      bookingData.carId,
      bookingData.startTime,
      bookingData.endTime,
      bookingData.status || 'active'
    ]
  );

  saveDatabase();

  const stmt = db.prepare('SELECT * FROM bookings WHERE id = last_insert_rowid()');
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return new Booking(row);
  }

  stmt.free();
  throw new Error('Не удалось создать бронирование');
}

// Обновить бронирование
function update(id, bookingData) {
  const db = getDatabase();
  if (!db) return null;

  const fields = [];
  const values = [];

  const fieldMappings = {
    userId: 'user_id',
    carId: 'car_id',
    startTime: 'start_time',
    endTime: 'end_time',
    actualStartTime: 'actual_start_time',
    actualEndTime: 'actual_end_time',
    status: 'status',
    totalPrice: 'total_price'
  };

  for (const [key, column] of Object.entries(fieldMappings)) {
    if (bookingData[key] !== undefined) {
      fields.push(`${column} = ?`);
      values.push(bookingData[key]);
    }
  }

  if (fields.length === 0) return findById(id);

  values.push(id);

  db.run(
    `UPDATE bookings SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  saveDatabase();
  return findById(id);
}

// Удалить бронирование
function remove(id) {
  const db = getDatabase();
  if (!db) return false;

  db.run('DELETE FROM bookings WHERE id = ?', [id]);
  saveDatabase();
  return true;
}

// Обновить статус бронирования
function updateStatus(id, status) {
  const db = getDatabase();
  if (!db) return null;

  const validStatuses = ['active', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error('Неверный статус бронирования');
  }

  db.run('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
  saveDatabase();
  return findById(id);
}

module.exports = {
  Booking,
  findAll,
  findById,
  findByUserId,
  findByCarId,
  create,
  update,
  remove,
  updateStatus
};
