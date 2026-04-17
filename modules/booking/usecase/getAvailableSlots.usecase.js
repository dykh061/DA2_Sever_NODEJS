class GetAvailableSlotsUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute(courtId, date) {
        if (!courtId || !date) throw new Error("Vui lòng cung cấp ID sân và Ngày đặt.");
        return await this.bookingRepository.getAvailableSlots(courtId, date);
    }
}
module.exports = GetAvailableSlotsUseCase;