const pricingRepository = require('../infrastructure/pricing.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { parseId } = require('../../../common/utils/parseId');
const { validateUpdatePricing } = require('../dto/updatePricing.dto');

class UpdatePricingUseCase {
  async execute(id, body) {
    const pricingId = parseId(id);
    const payload = validateUpdatePricing(body);

    const currentPricing = await pricingRepository.findById(pricingId);
    if (!currentPricing) {
      throw createAppError('Khong tim thay pricing', 404);
    }

    const finalData = {
      court_id: Object.prototype.hasOwnProperty.call(payload, 'court_id')
        ? payload.court_id
        : currentPricing.court_id,
      day_type: Object.prototype.hasOwnProperty.call(payload, 'day_type')
        ? payload.day_type
        : currentPricing.day_type,
      price: Object.prototype.hasOwnProperty.call(payload, 'price')
        ? payload.price
        : currentPricing.price,
      time_slot_id: Object.prototype.hasOwnProperty.call(payload, 'time_slot_id')
        ? payload.time_slot_id
        : currentPricing.time_slot_id
    };

    const courtExists = await pricingRepository.existsCourt(finalData.court_id);
    if (!courtExists) {
      throw createAppError('San khong ton tai', 404);
    }

    const timeSlotExists = await pricingRepository.existsTimeSlot(finalData.time_slot_id);
    if (!timeSlotExists) {
      throw createAppError('Khung gio khong ton tai', 404);
    }

    const duplicated = await pricingRepository.findDuplicate(
      finalData.court_id,
      finalData.day_type,
      finalData.time_slot_id,
      pricingId
    );

    if (duplicated) {
      throw createAppError('Gia san cho khung gio va loai ngay nay da ton tai', 409);
    }

    return await pricingRepository.update(pricingId, payload);
  }
}

module.exports = new UpdatePricingUseCase();