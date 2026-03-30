const db = require('../../../config/database');
const Pricing = require('../domain/pricing.entity');
const PricingRepository = require('../domain/pricing.repository');

class PricingRepositoryImpl extends PricingRepository {
  mapRow(row) {
    return new Pricing(
      row.id,
      row.court_id,
      row.day_type,
      Number(row.price),
      row.time_slot_id,
      row.court_name || null,
      row.start_time || null,
      row.end_time || null
    );
  }

  async findAll() {
    const [rows] = await db.query(
      `SELECT p.id, p.court_id, p.day_type, p.price, p.time_slot_id,
              c.name AS court_name, ts.start_time, ts.end_time
       FROM pricings p
       INNER JOIN courts c ON c.id = p.court_id
       INNER JOIN time_slots ts ON ts.id = p.time_slot_id
       ORDER BY p.id DESC`
    );

    return rows.map((row) => this.mapRow(row));
  }

  async findById(id) {
    const [rows] = await db.query(
      `SELECT p.id, p.court_id, p.day_type, p.price, p.time_slot_id,
              c.name AS court_name, ts.start_time, ts.end_time
       FROM pricings p
       INNER JOIN courts c ON c.id = p.court_id
       INNER JOIN time_slots ts ON ts.id = p.time_slot_id
       WHERE p.id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) return null;
    return this.mapRow(rows[0]);
  }

  async existsCourt(courtId) {
    const [rows] = await db.query(
      'SELECT id FROM courts WHERE id = ? LIMIT 1',
      [courtId]
    );
    return rows.length > 0;
  }

  async existsTimeSlot(timeSlotId) {
    const [rows] = await db.query(
      'SELECT id FROM time_slots WHERE id = ? LIMIT 1',
      [timeSlotId]
    );
    return rows.length > 0;
  }

  async findDuplicate(courtId, dayType, timeSlotId, excludeId = null) {
    let sql = `
      SELECT id
      FROM pricings
      WHERE court_id = ? AND day_type = ? AND time_slot_id = ?
    `;
    const params = [courtId, dayType, timeSlotId];

    if (excludeId) {
      sql += ' AND id <> ?';
      params.push(excludeId);
    }

    sql += ' LIMIT 1';

    const [rows] = await db.query(sql, params);
    return rows[0] || null;
  }

  async create(data) {
    const [result] = await db.query(
      `INSERT INTO pricings (court_id, day_type, price, time_slot_id)
       VALUES (?, ?, ?, ?)`,
      [data.court_id, data.day_type, data.price, data.time_slot_id]
    );

    return await this.findById(result.insertId);
  }

  async update(id, data) {
    const fields = [];
    const values = [];

    if (Object.prototype.hasOwnProperty.call(data, 'court_id')) {
      fields.push('court_id = ?');
      values.push(data.court_id);
    }

    if (Object.prototype.hasOwnProperty.call(data, 'day_type')) {
      fields.push('day_type = ?');
      values.push(data.day_type);
    }

    if (Object.prototype.hasOwnProperty.call(data, 'price')) {
      fields.push('price = ?');
      values.push(data.price);
    }

    if (Object.prototype.hasOwnProperty.call(data, 'time_slot_id')) {
      fields.push('time_slot_id = ?');
      values.push(data.time_slot_id);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(id);

    await db.query(
      `UPDATE pricings SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return await this.findById(id);
  }

  async delete(id) {
    await db.query('DELETE FROM pricings WHERE id = ?', [id]);
    return true;
  }
}

module.exports = new PricingRepositoryImpl();