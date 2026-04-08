const timeSlotRepository = require('../infrastructure/timeslot.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { validateCreateTimeSlot } = require('../dto/createTimeSlot.dto');

class CreateTimeSlotUseCase {
  async execute(body) {
    const data = validateCreateTimeSlot(body);

    const duplicated = await timeSlotRepository.findDuplicate(
      data.start_time,
      data.end_time
    );

    if (duplicated) {
      throw createAppError('Khung gio nay da ton tai', 409);
    }

    return await timeSlotRepository.create(data);
  }
}

module.exports = new CreateTimeSlotUseCase();