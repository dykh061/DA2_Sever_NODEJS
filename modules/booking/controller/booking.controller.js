const CreateBookingDTO = require('../../../modules/booking/dto/createBooking.dto');

class BookingController {
    constructor(createBookingUsecase,
        getAllBookingUseCase,
        getBookingDetailUseCase,
        cancelBookingUseCase,
        getBookingByUserIdUseCase,
    completeBookingUseCase,
getStatisticsUseCase,
getAvailableSlotsUseCase) {
        this.createBookingUsecase = createBookingUsecase;
        this.getAllBookingUseCase = getAllBookingUseCase;
        this.getBookingDetailUseCase = getBookingDetailUseCase;
        this.cancelBookingUseCase = cancelBookingUseCase;
        this.getBookingByUserIdUseCase = getBookingByUserIdUseCase;
        this.completeBookingUseCase = completeBookingUseCase;
        this.getStatisticsUseCase = getStatisticsUseCase;
        this.getAvailableSlotsUseCase = getAvailableSlotsUseCase;
    }

    createBooking = async (req, resizeBy, next) => {
        try {
            const userId = req.user.userId;
            const payload = {
                ...req.body,
                userId: userId
            };

            const dto = new CreateBookingDTO(payload);
            dto.validate();

            const result = await this.createBookingUsecase.execute(dto);

            return resizeBy.status(201).json({
                success: true,
                message: "Đặt lịch thành công!",
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }

    getAllBooking = async (req, res, next) => {
        try {
            const result = await this.getAllBookingUseCase.execute();
            return res.status(200).json({
                message: "Lấy danh sách đặt sân thành công",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }

    getBookingDetail = async (req, res, next) => {
        try {
            const bookingId = req.params.id;
            const result = await this.getBookingDetailUseCase.execute(bookingId);
            return res.status(200).json({
                message: "Lấy thành công  chi tiết đơn đặt sân!",
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }

    cancelBooking = async (req, res, next) => {
        try {
            const bookingId = req.params.id;
            const userId = req.user.userId; // Dữ liệu từ Token

            const message = await this.cancelBookingUseCase.execute(bookingId, userId);

            return res.status(200).json({
                success: true,
                message: message
            });
        } catch (error) {
            next(error);
        }
    }

    getBookingByUserId = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const result = await this.getBookingByUserIdUseCase.execute(userId);
            return res.status(200).json({
                success: true,
                message: "Lấy lịch sử đặt sân thành công!",
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }

    completeBooking = async (req, res, next) => {
        try {
            const bookingId = req.params.id;
            const adminId = req.user.userId; // Cần verifyToken và checkRole Admin
            const message = await this.completeBookingUseCase.execute(bookingId, adminId);
            return res.status(200).json({ success: true, message });
        } catch (error) { next(error); }
    }

    getStatistics = async (req, res, next) => {
        try {
            const data = await this.getStatisticsUseCase.execute();
            return res.status(200).json({ success: true, data });
        } catch (error) { next(error); }
    }

    getAvailableSlots = async (req, res, next) => {
        try {
            const { courtId, date } = req.query; // Gửi qua query params: ?courtId=1&date=2026-04-01
            const data = await this.getAvailableSlotsUseCase.execute(courtId, date);
            return res.status(200).json({ success: true, data });
        } catch (error) { next(error); }
    }
}
module.exports = BookingController;