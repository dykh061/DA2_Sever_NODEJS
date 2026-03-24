
const db = require('../../config/database');
const BookingRepository = require('../booking/infra/booking.repository.imple');
const CreateBookingUseCase = require('../booking/usecase/createBooking.usecase');

const bookingRepository = new BookingRepository(db);

const createBookingUseCase = new CreateBookingUseCase(bookingRepository);


const bookingController = new BookingController(createBookingUseCase);

module.exports = {
    bookingController
};