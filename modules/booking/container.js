
const db = require('../../config/database');
const BookingRepository = require('../booking/infra/booking.repository.imple');
const CreateBookingUseCase = require('../booking/usecase/createBooking.usecase');
const GetAllBookingUseCase = require('../booking/usecase/getAllBooking.usecase');
const GetBookingDetailUseCase = require('../booking/usecase/getBookingDetail.usecase')
const CancelBokingUseCase = require('../booking/usecase/cancelBooking.usecase');
const GetBookingByUserIdUseCase = require('../booking/usecase/getBookingByUserId.usecase');
const CompleteBookingUseCase = require('../booking/usecase/completeBooking.usecase');
const GetStatisticUseCase = require('../booking/usecase/getStatistics.usecase');
const GetAvailableSlots = require('../booking/usecase/getAvailableSlots.usecase');

const BookingController = require('../booking/controller/booking.controller');
const bookingRepository = new BookingRepository(db);

const createBookingUseCase = new CreateBookingUseCase(bookingRepository);
const getAllBookingUseCase = new GetAllBookingUseCase(bookingRepository);
const getBookingDetailUseCase = new GetBookingDetailUseCase(bookingRepository);
const cancelBookingUseCase = new CancelBokingUseCase(bookingRepository);
const getBookingByUserIdUseCase = new GetBookingByUserIdUseCase(bookingRepository);
const completeBookingUseCase = new CompleteBookingUseCase(bookingRepository);
const getStatisticUseCase = new GetStatisticUseCase(bookingRepository);
const getAvailableSlots = new GetAvailableSlots(bookingRepository);

const bookingController = new BookingController(createBookingUseCase,
    getAllBookingUseCase,
    getBookingDetailUseCase,
    cancelBookingUseCase,
    getBookingByUserIdUseCase,
    completeBookingUseCase,
    getStatisticUseCase,
    getAvailableSlots);

module.exports = {
    bookingController
};