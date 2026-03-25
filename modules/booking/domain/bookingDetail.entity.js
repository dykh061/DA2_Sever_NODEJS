class BookingDetail {
    constructor({ id, bookingId, timeSlotId, bookingDate, price, courtId }) {
        this.id = id || null;
        this.bookingId = bookingId || null;
        this.timeSlotId = timeSlotId;
        this.bookingDate = bookingDate;
        this.price = price;
        this.courtId = courtId;
    }
}
module.exports = BookingDetail;