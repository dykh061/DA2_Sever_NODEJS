class CourtRepository {
    async findAll() { throw new Error('Not implemented'); }
    async findById(id) { throw new Error('Not implemented'); }
    async findAllDetail() { throw new Error('Not implemented'); }
    async findDetailById(id) { throw new Error('Not implemented'); }

    async create(data) { throw new Error('Not implemented'); }
    async update(id, data) { throw new Error('Not implemented'); }
    async delete(id) { throw new Error('Not implemented'); }

    async findImagesByCourtId(courtId) { throw new Error('Not implemented'); }
    async findPricingsByCourtId(courtId) { throw new Error('Not implemented'); }

    async replaceImages(courtId, imageUrls) { throw new Error('Not implemented'); }
    async replacePricings(courtId, pricings) { throw new Error('Not implemented'); }
}

module.exports = CourtRepository;