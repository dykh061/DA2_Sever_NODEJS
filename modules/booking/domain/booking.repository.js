class BookingRepository{
    async checkAvailability(courtId, bookingDate, timeSlotIds) {
        throw new Error('Method "checkAvailability()" must be implemented.');
    }

    async getPricings(courtId, dayType, timeSlotIds) {
        throw new Error('Method "getPricings()" must be implemented.');
    }

    async createBookingTransaction(bookingEntity, totalAmount) {
        throw new Error('Method "createBookingTransaction()" must be implemented.');
    }
}
module.exports = BookingRepository;