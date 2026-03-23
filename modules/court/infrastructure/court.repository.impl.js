const db = require('../../../config/database');
const Court = require('../domain/court.entity');
const CourtRepository = require('../domain/court.repository');

class CourtRepositoryImpl extends CourtRepository {
    async findAll() {
        const [rows] = await db.query('SELECT * FROM courts ORDER BY id DESC');
        return rows.map((row) => new Court(row.id, row.name, row.status));
    }

    async findById(id) {
        const [rows] = await db.query('SELECT * FROM courts WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        return new Court(rows[0].id, rows[0].name, rows[0].status);
    }

    async findImagesByCourtId(courtId) {
        const [rows] = await db.query(
            'SELECT image_url FROM court_image WHERE court_id = ? ORDER BY id ASC',
            [courtId]
        );
        return rows.map((row) => row.image_url);
    }

    async findPricingsByCourtId(courtId) {
        const [rows] = await db.query(
            `SELECT id, court_id, day_type, price, time_slot_id
             FROM pricings
             WHERE court_id = ?
             ORDER BY id ASC`,
            [courtId]
        );
        return rows;
    }

    async findDetailById(id) {
        const court = await this.findById(id);
        if (!court) return null;

        const imageUrls = await this.findImagesByCourtId(id);
        const pricings = await this.findPricingsByCourtId(id);

        return new Court(court.id, court.name, court.status, imageUrls, pricings);
    }

    async findAllDetail() {
        const courts = await this.findAll();

        return await Promise.all(
            courts.map(async (court) => {
                const imageUrls = await this.findImagesByCourtId(court.id);
                const pricings = await this.findPricingsByCourtId(court.id);
                return new Court(court.id, court.name, court.status, imageUrls, pricings);
            })
        );
    }

    async create(data) {
        const [result] = await db.query(
            'INSERT INTO courts (name, status) VALUES (?, ?)',
            [data.name, data.status]
        );
        return new Court(result.insertId, data.name, data.status);
    }

    async update(id, data) {
        const fields = [];
        const values = [];

        if (Object.prototype.hasOwnProperty.call(data, 'name')) {
            fields.push('name = ?');
            values.push(data.name);
        }

        if (Object.prototype.hasOwnProperty.call(data, 'status')) {
            fields.push('status = ?');
            values.push(data.status);
        }

        if (fields.length === 0) {
            return await this.findById(id);
        }

        values.push(id);

        await db.query(
            `UPDATE courts SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return await this.findById(id);
    }

    async replaceImages(courtId, imageUrls) {
        await db.query('DELETE FROM court_image WHERE court_id = ?', [courtId]);

        for (const imageUrl of imageUrls) {
            await db.query(
                'INSERT INTO court_image (court_id, image_url) VALUES (?, ?)',
                [courtId, imageUrl]
            );
        }

        return true;
    }

    async replacePricings(courtId, pricings) {
        await db.query('DELETE FROM pricings WHERE court_id = ?', [courtId]);

        for (const pricing of pricings) {
            await db.query(
                'INSERT INTO pricings (court_id, day_type, price, time_slot_id) VALUES (?, ?, ?, ?)',
                [courtId, pricing.day_type, pricing.price, pricing.time_slot_id]
            );
        }

        return true;
    }

    async delete(id) {
        await db.query('DELETE FROM courts WHERE id = ?', [id]);
        return true;
    }
}

module.exports = new CourtRepositoryImpl();