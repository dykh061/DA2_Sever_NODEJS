const timeSlotRepository = require('../infrastructure/timeslot.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { parseId } = require('../../../common/utils/parseId');

class GetTimeSlotByIdUseCase {
  async execute(id) {
    const timeSlotId = parseId(id);
    const timeSlot = await timeSlotRepository.findById(timeSlotId);

    if (!timeSlot) {
      throw createAppError('Khong tim thay time slot', 404);
    }

    return timeSlot;
  }
}

module.exports = new GetTimeSlotByIdUseCase();