const courtRepository = require('../infrastructure/court.repository.impl');
const { validateCreateCourt } = require('../dto/createCourt.dto');

class CreateCourtUseCase {
    async execute(body) {
        const data = validateCreateCourt(body);

        const newCourt = await courtRepository.create({
            name: data.name,
            status: data.status
        });

        if (data.imageUrls.length > 0) {
            await courtRepository.replaceImages(newCourt.id, data.imageUrls);
        }

        if (data.pricings.length > 0) {
            await courtRepository.replacePricings(newCourt.id, data.pricings);
        }

        return await courtRepository.findDetailById(newCourt.id);
    }
}

module.exports = new CreateCourtUseCase();