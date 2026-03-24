const { badRequest } = require("../../../common/errors/appError");
const BookingDetail = require("../domain/bookingDetail.entity");

class CreateBookingDTO {
    constructor(data) {
        this.userId = data.userId;
        this.courtId = data.courtId;
        this.bookingDate = data.bookingDate;
        this.timeSlotIds = data.timeSlotIds;
        this.type = data.type || "normal";
    }

    validate(){
        if(!this.userId) throw badRequest("userId là bắt buộc.");
        if(!this.courtId) throw badRequest("courtId là bắt buộc.");
        if(!this.bookingDate){
            throw badRequest("bookingDate là bắt buộc.");
        } else if(isNaN(Date.parse(this.bookingDate))){
            throw badRequest("bookingDate không đúng định dạng thời gian.");
        }
        if(!Array.isArray(this.timeSlotIds) || this.timeSlotIds.length === 0){
            throw badRequest("Phải chọn ít nhất một khung giờ (timeSlotIds)");
        }

        return this;
    }
}
module.exports = CreateBookingDTO;