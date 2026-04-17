const { badRequest, notFound, forbidden } = require('../../../common/errors/appError');

class CancelBookingUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    async execute(bookingId, userId) {
        const booking = await this.bookingRepository.getBookingById(bookingId);
        if (!booking) {
            throw notFound("Không tìm thấy đơn đặt sân!");
        }

        const sqlCheckOwner = `SELECT user_id, status FROM bookings WHERE id = ?`;
        const [ownerRows] = await this.bookingRepository.db.query(sqlCheckOwner, [bookingId]);
        if (ownerRows[0].user_id !== userId) {
            throw forbidden("Bạn không có quyền xóa sân người khác!");
        }

        const oldStatus = ownerRows[0].status;
        if (oldStatus === 'CANCELED') {
            throw badRequest("Đơn đặt sân này đã được hủy trước đó rồi!");
        }

        // 3. Xử lý logic chặn 24h
        const firstSlot = await this.bookingRepository.getBookingStartTime(bookingId);
        if (firstSlot) {
            // Xử lý cẩn thận định dạng ngày giờ để tránh lệch múi giờ
            const dateObj = new Date(firstSlot.booking_date);
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            const timeStr = firstSlot.start_time; 

            // Ép múi giờ VN (+07:00) cho chắc chắn
            const bookingStartTime = new Date(`${yyyy}-${mm}-${dd}T${timeStr}+07:00`);
            const now = new Date();

            const diffInHours = (bookingStartTime - now) / (1000 * 60 * 60);

            if (diffInHours < 24) {
                throw badRequest("Bạn không thể hủy sân vì thời gian đến giờ chơi còn ít hơn 24 tiếng.");
            }
        }

        // 4. Gọi DB để thực hiện hủy
        await this.bookingRepository.cancelBookingTransaction(bookingId, oldStatus, userId);

        // 5. Lấy số điện thoại Admin và trả về câu thông báo
        const adminPhone = await this.bookingRepository.getAdminPhoneNumber();
        return `Hủy sân thành công! Sân đã được lưu vào lịch sử hủy. Nếu bạn đã thanh toán chuyển khoản, vui lòng liên hệ Admin qua số điện thoại ${adminPhone} để được hỗ trợ hoàn tiền.`;
    }
}

module.exports = CancelBookingUseCase;