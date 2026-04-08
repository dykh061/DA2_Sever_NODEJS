const db = require('../../../config/database');
const TimeSlot = require('../domain/timeslot.entity');
const TimeSlotRepository = require('../domain/timeslot.repository');

class TimeSlotRepositoryImpl extends TimeSlotRepository {
  mapRow(row) {
    return new TimeSlot(
      row.id,
      row.start_time,
      row.end_time
    );
  }

  async findAll() {
    const [rows] = await db.query(
      `SELECT id, start_time, end_time
       FROM time_slots
       ORDER BY start_time ASC, end_time ASC`
    );

    return rows.map((row) => this.mapRow(row));
  }

  async findById(id) {
    const [rows] = await db.query(
      `SELECT id, start_time, end_time
       FROM time_slots
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) return null;
    return this.mapRow(rows[0]);
  }

  async findDuplicate(startTime, endTime, excludeId = null) {
    let sql = `
      SELECT id, start_time, end_time
      FROM time_slots
      WHERE start_time = ? AND end_time = ?
    `;
    const params = [startTime, endTime];

    if (excludeId) {
      sql += ' AND id <> ?';
      params.push(excludeId);
    }

    sql += ' LIMIT 1';

    const [rows] = await db.query(sql, params);
    return rows[0] || null;
  }

  async findOverlap(startTime, endTime, excludeId = null) {
    let sql = `
      SELECT id, start_time, end_time
      FROM time_slots
      WHERE (? < end_time AND ? > start_time)
    `;
    const params = [startTime, endTime];

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
      `INSERT INTO time_slots (start_time, end_time)
       VALUES (?, ?)`,
      [data.start_time, data.end_time]
    );

    return await this.findById(result.insertId);
  }

  async update(id, data) {
    const fields = [];
    const values = [];

    if (Object.prototype.hasOwnProperty.call(data, 'start_time')) {
      fields.push('start_time = ?');
      values.push(data.start_time);
    }

    if (Object.prototype.hasOwnProperty.call(data, 'end_time')) {
      fields.push('end_time = ?');
      values.push(data.end_time);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(id);

    await db.query(
      `UPDATE time_slots SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return await this.findById(id);
  }

  async delete(id) {
    await db.query('DELETE FROM time_slots WHERE id = ?', [id]);
    return true;
  }

  async countPricingReferences(timeSlotId) {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS total
       FROM pricings
       WHERE time_slot_id = ?`,
      [timeSlotId]
    );

    return Number(rows[0]?.total || 0);
  }

  async countBookingReferences(timeSlotId) {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS total
       FROM booking_details
       WHERE time_slot_id = ?`,
      [timeSlotId]
    );

    return Number(rows[0]?.total || 0);
  }
}

module.exports = new TimeSlotRepositoryImpl();