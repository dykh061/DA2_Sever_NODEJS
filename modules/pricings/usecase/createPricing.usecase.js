const pricingRepository = require('../infrastructure/pricing.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { validateCreatePricing } = require('../dto/createPricing.dto');

class CreatePricingUseCase {
  async execute(body) {
    const data = validateCreatePricing(body);

    const courtExists = await pricingRepository.existsCourt(data.court_id);
    if (!courtExists) {
      throw createAppError('San khong ton tai', 404);
    }

    const timeSlotExists = await pricingRepository.existsTimeSlot(data.time_slot_id);
    if (!timeSlotExists) {
      throw createAppError('Khung gio khong ton tai', 404);
    }

    const duplicated = await pricingRepository.findDuplicate(
      data.court_id,
      data.day_type,
      data.time_slot_id
    );

    if (duplicated) {
      throw createAppError('Gia san cho khung gio va loai ngay nay da ton tai', 409);
    }

    return await pricingRepository.create(data);
  }
}

module.exports = new CreatePricingUseCase();