const BookingRepository = require('../../../modules/booking/domain/booking.repository');

class BookingRepositoryImplement extends BookingRepository {
    constructor(db) {
        super();
        this.db = db;
    }
    //Kiểm tra có bị trùng lịch
    async checkAvailability(courtId, bookingDate, timeSlotIds) {
        // Tạo chuỗi '?, ?, ?' tương ứng với độ dài mảng timeSlotIds để chống SQL Injection
        const placeHolders = timeSlotIds.map(() => '?').join(',');

        const sql = `SELECT time_slot_id 
        FROM booking_details 
        WHERE court_id = ? AND booking_date = ? AND time_slot_id IN (${placeHolders})
        `;

        const [rows] = await this.db.query(sql, [courtId, bookingDate, ...timeSlotIds])

        return rows.map(row => row.time_slot_id);
    }

    async getUserPhoneNumber(userId) {
        const sql = `SELECT phone_number FROM users WHERE id = ?`;
        const [rows] = await this.db.query(sql, [userId]);
        
        if (rows.length === 0) return null;
        return rows[0].phone_number;
    }

    async getPricings(courtId, dayType, timeSlotIds) {

        const placeHolders = timeSlotIds.map(() => '?').join(',');
        const sql = `
            SELECT time_slot_id, price
            FROM pricings
            WHERE court_id = ?
                AND day_type = ?
                AND time_slot_id IN (${placeHolders})
        `;
        const [rows] = await this.db.query(sql, [courtId, dayType, ...timeSlotIds]);

        return rows;
    }

    async createBookingTransaction(bookingEntity, totalAmount) {
        const connection = await this.db.getConnection();
        await connection.beginTransaction();

        try {
            const [bookingResult] = await connection.query(
                `INSERT INTO bookings (user_id,status, type, created_at) VALUES (?,?,?,?)`,
                [bookingEntity.userId, bookingEntity.status, bookingEntity.type, bookingEntity.createdAt]
            );

            const newBookingId = bookingResult.insertId;

            for (const detail of bookingEntity.details) {
                await connection.query(
                    `INSERT INTO booking_details (booking_id, time_slot_id, booking_date, price, court_id)
                    VALUES (?,?,?,?,?)`,
                    [newBookingId, detail.timeSlotId, detail.bookingDate, detail.price, detail.courtId]
                );
            }

            //Sinh bill
            await connection.query(
                `INSERT INTO bills (booking_id,total_price,created_at,status)
                VALUES (?,?,?,?)`,
                [newBookingId, totalAmount, new Date(), 'UNPAID']
            );

            await connection.commit();
            return newBookingId;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            // TRẢ KẾT NỐI LẠI CHO POOL ĐỂ TRÁNH TRÀN BỘ NHỚ
            connection.release();
        }
    }
}
module.exports = BookingRepositoryImplement;