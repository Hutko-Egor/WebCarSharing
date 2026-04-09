const bcrypt = require('bcryptjs');
const { getDatabase, saveDatabase } = require('../config/database');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.phone = data.phone;
    this.role = data.role || 'user';
    this.createdAt = data.created_at || data.createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      phone: this.phone,
      role: this.role,
      createdAt: this.createdAt
    };
  }
}

// Найти пользователя по email
function findByEmail(email) {
  const db = getDatabase();
  if (!db) return null;
  
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  stmt.bind([email]);
  
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return new User(row);
  }
  
  stmt.free();
  return null;
}

// Найти пользователя по ID
async function findById(id) {
  const db = getDatabase();
  if (!db) return null;
  
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  stmt.bind([id]);
  
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return new User(row);
  }
  
  stmt.free();
  return null;
}

// Создать нового пользователя
async function create(userData) {
  const db = getDatabase();
  if (!db) throw new Error('База данных не инициализирована');

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  db.run(
    'INSERT INTO users (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)',
    [userData.email, hashedPassword, userData.name, userData.phone, userData.role || 'user']
  );

  saveDatabase();

  // Получаем созданного пользователя
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  stmt.bind([userData.email]);

  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return new User(row);
  }

  stmt.free();
  throw new Error('Не удалось создать пользователя');
}

// Проверка пароля
async function validatePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Обновить данные пользователя
function update(id, userData) {
  const db = getDatabase();
  if (!db) return null;
  
  const fields = [];
  const values = [];
  
  if (userData.name) {
    fields.push('name = ?');
    values.push(userData.name);
  }
  if (userData.phone) {
    fields.push('phone = ?');
    values.push(userData.phone);
  }
  
  if (fields.length === 0) return findById(id);
  
  values.push(id);
  
  db.run(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  saveDatabase();
  return findById(id);
}

// Удалить пользователя
function remove(id) {
  const db = getDatabase();
  if (!db) return false;

  db.run('DELETE FROM users WHERE id = ?', [id]);
  saveDatabase();
  return true;
}

// Получить всех пользователей
function findAll() {
  const db = getDatabase();
  if (!db) return [];

  const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
  stmt.bind();

  const users = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    users.push(new User(row));
  }

  stmt.free();
  return users;
}

// Получить пользователя по роли
function findByRole(role) {
  const db = getDatabase();
  if (!db) return [];

  const stmt = db.prepare('SELECT * FROM users WHERE role = ? ORDER BY created_at DESC');
  stmt.bind([role]);

  const users = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    users.push(new User(row));
  }

  stmt.free();
  return users;
}

module.exports = {
  User,
  findByEmail,
  findById,
  create,
  validatePassword,
  update,
  remove,
  findAll,
  findByRole
};
