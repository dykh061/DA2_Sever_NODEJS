const courtRepository = require('../infrastructure/court.repository.impl');

class GetAllCourtsUseCase {
    async execute() {
        return await courtRepository.findAllDetail();
    }
}

module.exports = new GetAllCourtsUseCase();