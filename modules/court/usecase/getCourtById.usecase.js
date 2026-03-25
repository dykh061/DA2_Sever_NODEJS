const courtRepository = require('../infrastructure/court.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { parseId } = require('../../../common/utils/parseId');

class GetCourtByIdUseCase {
    async execute(id) {
        const courtId = parseId(id);
        const court = await courtRepository.findDetailById(courtId);

        if (!court) {
            throw createAppError('Khong tim thay Court', 404);
        }

        return court;
    }
}

module.exports = new GetCourtByIdUseCase();