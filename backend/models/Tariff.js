const { getDatabase, saveDatabase } = require('../config/database');

class Tariff {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.pricePerMinute = data.price_per_minute;
    this.pricePerHour = data.price_per_hour;
    this.pricePerDay = data.price_per_day;
    this.createdAt = data.created_at || data.createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      pricePerMinute: this.pricePerMinute,
      pricePerHour: this.pricePerHour,
      pricePerDay: this.pricePerDay,
      createdAt: this.createdAt
    };
  }
}

// Получить все тарифы
function findAll() {
  const db = getDatabase();
  if (!db) return [];

  const stmt = db.prepare('SELECT * FROM tariffs ORDER BY price_per_minute');
  stmt.bind();

  const tariffs = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    tariffs.push(new Tariff(row));
  }

  stmt.free();
  return tariffs;
}

// Найти тариф по ID
function findById(id) {
  const db = getDatabase();
  if (!db) return null;

  const stmt = db.prepare('SELECT * FROM tariffs WHERE id = ?');
  stmt.bind([id]);

  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return new Tariff(row);
  }

  stmt.free();
  return null;
}

// Создать тариф
function create(tariffData) {
  const db = getDatabase();
  if (!db) throw new Error('База данных не инициализирована');

  db.run(
    `INSERT INTO tariffs (name, description, price_per_minute, price_per_hour, price_per_day)
     VALUES (?, ?, ?, ?, ?)`,
    [
      tariffData.name,
      tariffData.description,
      tariffData.pricePerMinute,
      tariffData.pricePerHour,
      tariffData.pricePerDay
    ]
  );

  saveDatabase();

  const stmt = db.prepare('SELECT * FROM tariffs WHERE id = last_insert_rowid()');
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return new Tariff(row);
  }

  stmt.free();
  throw new Error('Не удалось создать тариф');
}

// Обновить тариф
function update(id, tariffData) {
  const db = getDatabase();
  if (!db) return null;

  const fields = [];
  const values = [];

  const fieldMappings = {
    name: 'name',
    description: 'description',
    pricePerMinute: 'price_per_minute',
    pricePerHour: 'price_per_hour',
    pricePerDay: 'price_per_day'
  };

  for (const [key, column] of Object.entries(fieldMappings)) {
    if (tariffData[key] !== undefined) {
      fields.push(`${column} = ?`);
      values.push(tariffData[key]);
    }
  }

  if (fields.length === 0) return findById(id);

  values.push(id);

  db.run(
    `UPDATE tariffs SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  saveDatabase();
  return findById(id);
}

// Удалить тариф
function remove(id) {
  const db = getDatabase();
  if (!db) return false;

  db.run('DELETE FROM tariffs WHERE id = ?', [id]);
  saveDatabase();
  return true;
}

module.exports = {
  Tariff,
  findAll,
  findById,
  create,
  update,
  remove
};
