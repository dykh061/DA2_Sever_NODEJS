const CreateBookingDTO = require('../../../modules/booking/dto/createBooking.dto');

class BookingController {
    constructor(createBookingUsecase){
        this.createBookingUsecase=createBookingUsecase;
    }

    createBooking = async (req, resizeBy, next)=>{
        try {
            const userId = req.user.userId;
            const payload = {
                ...req.body,
                userId: userId
            };
            
            const dto = new CreateBookingDTO(payload);
            dto.validate();
            
            const result = await this.createBookingUsecase.execyte(dto);

            return resizeBy.status(201).json({
                success: true,
                message: "Đặt lịch thành công!",
                data: result
            });
        }
        catch(error){
            next(error);
        }
    }
}
module.exports = BookingController;