class CompleteBookingUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute(bookingId, adminId) {
        const booking = await this.bookingRepository.getBookingById(bookingId);
        if (!booking) throw new Error("Không tìm thấy hóa đơn!");
        if (booking.status === 'COMPLETED' || booking.status === 'CANCELED') {
            throw new Error(`Không thể check-in đơn đang ở trạng thái: ${booking.status}`);
        }
        await this.bookingRepository.completeBookingTransaction(bookingId, adminId);
        return "Check-in và xác nhận thanh toán thành công!";
    }
}
module.exports = CompleteBookingUseCase;