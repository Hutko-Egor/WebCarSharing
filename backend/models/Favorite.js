const { getDatabase, saveDatabase } = require('../config/database');

class Favorite {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.carId = data.car_id;
    this.createdAt = data.created_at || data.createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      carId: this.carId,
      createdAt: this.createdAt
    };
  }
}

// Получить все избранные пользователя
async function findByUserId(userId) {
  const db = getDatabase();
  if (!db) return [];

  const stmt = db.prepare('SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC');
  stmt.bind([userId]);

  const favorites = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    favorites.push(new Favorite(row));
  }

  stmt.free();
  return favorites;
}

// Найти конкретную запись избранного
async function find(userId, carId) {
  const db = getDatabase();
  if (!db) return null;

  const stmt = db.prepare('SELECT * FROM favorites WHERE user_id = ? AND car_id = ?');
  stmt.bind([userId, carId]);

  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return new Favorite(row);
  }

  stmt.free();
  return null;
}

// Добавить в избранное
async function add(userId, carId) {
  const db = getDatabase();
  if (!db) throw new Error('База данных не инициализирована');

  // Проверяем, существует ли уже такая запись
  const existing = find(userId, carId);
  if (existing) {
    return existing;
  }

  db.run(
    'INSERT INTO favorites (user_id, car_id) VALUES (?, ?)',
    [userId, carId]
  );

  saveDatabase();

  const stmt = db.prepare('SELECT * FROM favorites WHERE user_id = ? AND car_id = ?');
  stmt.bind([userId, carId]);

  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return new Favorite(row);
  }

  stmt.free();
  throw new Error('Не удалось добавить в избранное');
}

// Удалить из избранного
async function remove(userId, carId) {
  const db = getDatabase();
  if (!db) return false;

  db.run('DELETE FROM favorites WHERE user_id = ? AND car_id = ?', [userId, carId]);
  saveDatabase();
  return true;
}

// Переключить статус избранного
async function toggle(userId, carId) {
  const existing = await find(userId, carId);
  if (existing) {
    await remove(userId, carId);
    return { added: false };
  } else {
    await add(userId, carId);
    return { added: true };
  }
}

module.exports = {
  Favorite,
  findByUserId,
  find,
  add,
  remove,
  toggle
};
