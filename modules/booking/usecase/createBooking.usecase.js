const BookingEntity = require('../../../modules/booking/domain/booking.entity');
const BookingDetailEntity = require('../../../modules/booking/domain/bookingDetail.entity');

const { conflict, badRequest } = require('../../../common/errors/appError');

class CreateBookingUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    async execute(dto) {
        const { userId, courtId, bookingDate, timeSlotIds, type } = dto;
        //B0 kiểm tra ngày đặt có âm và đã điền số điện thoại chưa
        const userPhone = await this.bookingRepository.getUserPhoneNumber(userId);
        if (!userPhone) {
            throw badRequest("Bạn chưa có số điện thoại. Vui lòng vào trang cá nhân cập nhật số điện thoại trước khi đặt sân nhé!");
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const bookingDateObj = new Date(bookingDate);
        if (bookingDateObj < today) {
            throw badRequest("Không thể đặt sân trong quá khứ. Vui lòng chọn ngày từ hôm nay trở đi.");
        }

        //B1 Kiểm tra trùng lịch
        const bookedSlots = await this.bookingRepository.checkAvailability(courtId, bookingDate, timeSlotIds);
        if (bookedSlots.length > 0) {
            throw conflict(`Sân đã được đặt vào các khung giờ: ${bookedSlots.join(', ')}. Vui lòng chọn giờ khác.`);
        }
        //B2 tính toán tiền dựa vào loại ngày
        const dateObj = new Date(bookingDate);
        const dayOfWeek = dateObj.getDay();
        const dayType = (dayOfWeek === 0 || dayOfWeek === 6) ? 'WEEKEND' : 'NORMAL';

        const pricings = await this.bookingRepository.getPricings(courtId, dayType, timeSlotIds);

        if (pricings.length !== timeSlotIds.length) {
            throw badRequest("Hệ thống chưa thiết lập giá cho một số khung giờ bạn chọn. Vui lòng liên hệ Admin.");
        }

        //B3 đóng gói dữ liệu
        const bookingEntity = new BookingEntity({ userId, type });
        let totalAmount = 0;

        for (const slotId of timeSlotIds) {
            const pricing = pricings.find(p => p.time_slot_id === slotId);

            const detail = new BookingDetailEntity({
                timeSlotId: slotId,
                bookingDate: bookingDate,
                price: pricing.price,
                courtId: courtId
            });

            bookingEntity.addDetails(detail);
            totalAmount += Number(pricing.price);
        }

        //B4 lưu vào db
        const newBookingId = await this.bookingRepository.createBookingTransaction(bookingEntity, totalAmount);
        //B5 trả về kết quả
        return {
            bookingId: newBookingId,
            totalAmount: totalAmount,
            status: bookingEntity.status
        };
    }
}

module.exports = CreateBookingUseCase;