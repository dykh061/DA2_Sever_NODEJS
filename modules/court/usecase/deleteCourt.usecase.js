const courtRepository = require('../infrastructure/court.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { parseId } = require('../../../common/utils/parseId');

class DeleteCourtUseCase {
    async execute(id) {
        const courtId = parseId(id);
        const court = await courtRepository.findById(courtId);

        if (!court) {
            throw createAppError('Khong tim thay Court', 404);
        }

        return await courtRepository.delete(courtId);
    }
}

module.exports = new DeleteCourtUseCase();