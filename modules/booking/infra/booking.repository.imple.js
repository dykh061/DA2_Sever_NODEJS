const BookingRepository = require('../../../modules/booking/domain/booking.repository');

class BookingRepositoryImplement extends BookingRepository {
    constructor(db) {
        super();
        this.db = db;
    }

    async getAllBooking() {
        const sql = `SELECT b.id, b.status, b.type, b.created_at, u.username as customer_name, u.phone_number 
                    FROM bookings b join users u ON u.id=b.user_id
                    ORDER BY b.created_at DESC`;
        const [rows] = await this.db.query(sql);
        return rows;
    }

    asyncgetBookingByUserId(userId){
        const sql = ``;
    }

    async getBookingById(bookingId) {
        const sql = `SELECT b.id, b.status, b.type, b.created_at, u.username AS customer_name, u.phone_number,
                    bi.total_price, bi.status AS payment_status
                    FROM bookings b JOIN users u ON b.user_id = u.id
                    LEFT JOIN bills bi ON b.id = bi.booking_id
                    WHERE b.id = ?`;
        const [bookingRows] = await this.db.query(sql, [bookingId]);

        if (bookingRows.length === 0) {
            return null;
        }

        const bookingData = bookingRows[0];

        const sqlDetail = `SELECT bd.booking_date, bd.price, c.name AS court_name, t.start_time, t.end_time
                            FROM booking_details bd JOIN courts c ON bd.court_id = c.id
                            JOIN time_slots t ON bd.time_slot_id = t.id
                            WHERE bd.booking_id = ?`;
        const [detailRows] = await this.db.query(sqlDetail, [bookingId]);

        bookingData.details = detailRows;
        return bookingData;
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

    async cancelBookingTransaction(bookingId, oldStatus, userId) {
        const connection = await this.db.getConnection();
        await connection.beginTransaction();
        try {
            const sqlBooking = `UPDATE bookings SET status = 'CANCELED' WHERE id = ?`;
            await connection.query(sqlBooking, [bookingId]);

            const sqlBill = `UPDATE bills SET status = 'CANCELED' WHERE booking_id = ?`;
            await connection.query(sqlBill, [bookingId]);
            const sqlHistory = `INSERT INTO booking_history (booking_id, old_status, new_status, changed_by, change_time, note)
                            VALUES (?,?,?,?,?,?)`;
            await connection.query(sqlHistory, [bookingId, oldStatus, 'CANCELED', userId, new Date(), 'Khách hàng đã chủ động hủy sân!']);

            await connection.commit();
            return true;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    async getBookingStartTime(bookingId) {
        const sql = `SELECT bd.booking_date, t.start_time
                    FROM booking_details bd JOIN time_slots t ON bd.time_slot_id = t.id
                    WHERE bd.booking_id = ?
                    ORDER BY bd.booking_date ASC, t.start_time ASC LIMIT 1`;
        const [rows] = await this.db.query(sql, [bookingId]);
        return rows[0] || null;
    }

    async getAdminPhoneNumber() {
        const sql = `SELECT phone_number FROM users WHERE role_id = 1 AND phone_number IS NOT NULL LIMIT 1`;
        const [rows] = await this.db.query(sql);
        if (rows.length === 0) return '0123456789';

        return rows[0].phone_number;
    }
    async getBookingByUserId(userId) {
        
        const sql = `
            SELECT b.id, b.status, b.type, b.created_at, 
                   bi.total_price, bi.status AS payment_status
            FROM bookings b 
            LEFT JOIN bills bi ON b.id = bi.booking_id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `;
        const [rows] = await this.db.query(sql, [userId]);
        
        return rows;
    }

    async completeBookingTransaction(bookingId, adminId) {
        const connection = await this.db.getConnection();
        await connection.beginTransaction();
        try {
    
            const [oldRows] = await connection.query(`SELECT status FROM bookings WHERE id = ?`, [bookingId]);
            const oldStatus = oldRows.length > 0 ? oldRows[0].status : 'pending';

            await connection.query(`UPDATE bookings SET status = 'COMPLETED' WHERE id = ?`, [bookingId]);
            await connection.query(`UPDATE bills SET status = 'PAID' WHERE booking_id = ?`, [bookingId]);
   
            await connection.query(
                `INSERT INTO booking_history (booking_id, old_status, new_status, changed_by, change_time, note) 
                 VALUES (?, ?, 'COMPLETED', ?, ?, 'Admin xác nhận thanh toán và check-in')`,
                [bookingId, oldStatus, adminId, new Date()]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async getRevenueStatistics() {
        const sql = `
            SELECT 
                COUNT(id) AS total_paid_bills,
                SUM(total_price) AS total_revenue
            FROM bills 
            WHERE status = 'PAID'
        `;
        const [rows] = await this.db.query(sql);
        return rows[0];
    }

    async getAvailableSlots(courtId, date) {
       
        const [allSlots] = await this.db.query(`SELECT id, start_time, end_time FROM time_slots`);

        const sqlBooked = `
            SELECT bd.time_slot_id 
            FROM booking_details bd
            JOIN bookings b ON bd.booking_id = b.id
            WHERE bd.court_id = ? AND bd.booking_date = ? AND b.status != 'CANCELED'
        `;
        const [bookedRows] = await this.db.query(sqlBooked, [courtId, date]);
        const bookedSlotIds = bookedRows.map(row => row.time_slot_id);


        return allSlots.map(slot => ({
            ...slot,
            isBooked: bookedSlotIds.includes(slot.id)
        }));
    }
}
module.exports = BookingRepositoryImplement;