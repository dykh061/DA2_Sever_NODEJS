const pricingRepository = require('../infrastructure/pricing.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { parseId } = require('../../../common/utils/parseId');

class GetPricingByIdUseCase {
  async execute(id) {
    const pricingId = parseId(id);
    const pricing = await pricingRepository.findById(pricingId);

    if (!pricing) {
      throw createAppError('Khong tim thay pricing', 404);
    }

    return pricing;
  }
}

module.exports = new GetPricingByIdUseCase();