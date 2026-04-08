const timeSlotRepository = require('../infrastructure/timeslot.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { parseId } = require('../../../common/utils/parseId');
const { validateUpdateTimeSlot } = require('../dto/updateTimeSlot.dto');
const { toSeconds } = require('../dto/createTimeSlot.dto');

class UpdateTimeSlotUseCase {
  async execute(id, body) {
    const timeSlotId = parseId(id);
    const payload = validateUpdateTimeSlot(body);

    const currentTimeSlot = await timeSlotRepository.findById(timeSlotId);
    if (!currentTimeSlot) {
      throw createAppError('Khong tim thay time slot', 404);
    }

    const finalData = {
      start_time: Object.prototype.hasOwnProperty.call(payload, 'start_time')
        ? payload.start_time
        : currentTimeSlot.start_time,
      end_time: Object.prototype.hasOwnProperty.call(payload, 'end_time')
        ? payload.end_time
        : currentTimeSlot.end_time
    };

    if (toSeconds(finalData.start_time) >= toSeconds(finalData.end_time)) {
      throw createAppError('start_time phai nho hon end_time', 400);
    }

    const duplicated = await timeSlotRepository.findDuplicate(
      finalData.start_time,
      finalData.end_time,
      timeSlotId
    );

    if (duplicated) {
      throw createAppError('Khung gio nay da ton tai', 409);
    }

    return await timeSlotRepository.update(timeSlotId, payload);
  }
}

module.exports = new UpdateTimeSlotUseCase();