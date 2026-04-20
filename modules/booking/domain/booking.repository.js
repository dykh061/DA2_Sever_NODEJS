class BookingRepository {
    async getAllBooking() {
        throw new Error('Method "getAllBooking()" must be implemented.');
    }
    async getBookingById(bookingId) {
        throw new Error('Method "getAllBooking()" must be implemented.');
    }
    async checkAvailability(courtId, bookingDate, timeSlotIds) {
        throw new Error('Method "getBookingById()" must be implemented.');
    }

    async getPricings(courtId, dayType, timeSlotIds) {
        throw new Error('Method "getPricings()" must be implemented.');
    }

    async createBookingTransaction(bookingEntity, totalAmount) {
        throw new Error('Method "createBookingTransaction()" must be implemented.');
    }
    async cancelBookingTransaction(bookingId, oldStatus, userId) {
        throw new Error('Method "cancelBookingTransaction()" must be implemented.');
    }
    async getBookingStartTime(bookingId) {
        throw new Error('Method "getBookingStartTime()" must be implemented.');
    }
    async getAdminPhoneNumber() {
        throw new Error('Method "getAdminPhoneNumber()" must be implemented.');
    }
    async getBookingByUserId(userId) {
        throw new Error('Method "getBookingByUserId()" must be implemented.');
    }
    async completeBookingTransaction(bookingId, adminId) {
        throw new Error('Method "completeBookingTransaction()" must be implemented.');
    }
    async getRevenueStatistics() {
        throw new Error('Method "getRevenueStatistics()" must be implemented.');
    }
    async getAvailableSlots(courtId, date) {
        throw new Error('Method "getAvailableSlots()" must be implemented.');
    }
}
module.exports = BookingRepository;