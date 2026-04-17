class GetBookingByUserIdUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    async execute(userId) {
        if (!userId) {
            throw new Error("Không tìm thấy thông tin người dùng (userId bị thiếu).");
        }

        const bookings = await this.bookingRepository.getBookingByUserId(userId);

        return bookings;
    }
}
module.exports = GetBookingByUserIdUseCase;