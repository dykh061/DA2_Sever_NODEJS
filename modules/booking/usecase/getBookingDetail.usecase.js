const { notFound } = require('../../../common/errors/appError');

class GetBookingDetailUseCase{
    constructor(bookingRepository){
        this.bookingRepository = bookingRepository;
    }

    async execute(bookingId){
        if(!bookingId){
            throw new Error("Không tìm thấy Id");
        }

        const bookingDetail = await this.bookingRepository.getBookingById(bookingId);
        if(!bookingDetail){
            throw notFound('Không tìm thấy thông tin đặt sân!');
        }

        return bookingDetail;
    }
}
module.exports = GetBookingDetailUseCase;