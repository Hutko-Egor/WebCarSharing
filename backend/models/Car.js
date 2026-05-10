const { getDatabase } = require('../config/database');

class Car {
  constructor(data) {
    this.id = data.id;
    this.brand = data.brand;
    this.model = data.model;
    this.year = data.year;
    this.licensePlate = data.licensePlate;
    this.status = data.status;
    this.tariffId = data.tariffId;
    this.transmission = data.transmission;
    this.seats = data.seats;
    this.carType = data.carType;
    this.color = data.color;
  }

  static async findAll() {
    const db = getDatabase();
    const rows = await db.all('SELECT * FROM cars');
    return rows.map(row => new Car(row));
  }

  // ТОТ САМЫЙ МЕТОД ПОИСКА
  static async findById(id) {
    const db = getDatabase();
    // Используем Number(id), чтобы поиск сработал, даже если пришла строка
    const row = await db.get('SELECT * FROM cars WHERE id = ?', [Number(id)]);
    return row ? new Car(row) : null;
  }
}

module.exports = Car;