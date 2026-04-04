const timeSlotRepository = require('../infrastructure/timeslot.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { parseId } = require('../../../common/utils/parseId');

class DeleteTimeSlotUseCase {
  async execute(id) {
    const timeSlotId = parseId(id);
    const timeSlot = await timeSlotRepository.findById(timeSlotId);

    if (!timeSlot) {
      throw createAppError('Khong tim thay time slot', 404);
    }

    const pricingRefs = await timeSlotRepository.countPricingReferences(timeSlotId);
    if (pricingRefs > 0) {
      throw createAppError('Khung gio dang duoc su dung trong bang pricings', 409);
    }

    const bookingRefs = await timeSlotRepository.countBookingReferences(timeSlotId);
    if (bookingRefs > 0) {
      throw createAppError('Khung gio dang duoc su dung trong booking_details', 409);
    }

    return await timeSlotRepository.delete(timeSlotId);
  }
}

module.exports = new DeleteTimeSlotUseCase();