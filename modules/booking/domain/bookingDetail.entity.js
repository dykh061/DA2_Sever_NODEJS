class BookingDetail{
    constructor( {id,bookingId,timeSlotID,bookingDate,price,court_id}){
        this.id=id || null;
        this.bookingId=bookingId || null;
        this.timeSlotID=timeSlotID;
        this.bookingDate=bookingDate;
        this.court_id=court_id;
    }
}
module.exports = BookingDetail;