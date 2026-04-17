class GetStatisticsUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute() {
        const stats = await this.bookingRepository.getRevenueStatistics();
        return {
            totalBills: stats.total_paid_bills || 0,
            totalRevenue: stats.total_revenue || 0
        };
    }
}
module.exports = GetStatisticsUseCase;