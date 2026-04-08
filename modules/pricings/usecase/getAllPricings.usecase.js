const pricingRepository = require('../infrastructure/pricing.repository.impl');

class GetAllPricingsUseCase {
  async execute() {
    return await pricingRepository.findAll();
  }
}

module.exports = new GetAllPricingsUseCase();