const courtRepository = require('../infrastructure/court.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { parseId } = require('../../../common/utils/parseId');
const { validateUpdateCourt } = require('../dto/updateCourt.dto');

class UpdateCourtUseCase {
    async execute(id, body) {
        const courtId = parseId(id);
        const data = validateUpdateCourt(body);

        const court = await courtRepository.findById(courtId);
        if (!court) {
            throw createAppError('Khong tim thay Court', 404);
        }

        await courtRepository.update(courtId, data);

        if (Object.prototype.hasOwnProperty.call(data, 'imageUrls')) {
            await courtRepository.replaceImages(courtId, data.imageUrls);
        }

        if (Object.prototype.hasOwnProperty.call(data, 'pricings')) {
            await courtRepository.replacePricings(courtId, data.pricings);
        }

        return await courtRepository.findDetailById(courtId);
    }
}

module.exports = new UpdateCourtUseCase();