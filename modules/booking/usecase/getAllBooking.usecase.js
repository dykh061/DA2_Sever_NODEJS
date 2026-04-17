class GetAllBokingUseCase{
    constructor(bookingRepository){
        this.bookingRepository = bookingRepository;
    }
    async execute(){
        const bookings = await this.bookingRepository.getAllBooking();
        return bookings;
    }
}
module.exports = GetAllBokingUseCase;