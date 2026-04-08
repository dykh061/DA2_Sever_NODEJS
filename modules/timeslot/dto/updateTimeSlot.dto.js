const { createAppError } = require('../../../common/errors/appError');
const { normalizeTime } = require('./createTimeSlot.dto');

const validateUpdateTimeSlot = (body) => {
  const result = {};
  const hasStartTime = Object.prototype.hasOwnProperty.call(body || {}, 'start_time');
  const hasEndTime = Object.prototype.hasOwnProperty.call(body || {}, 'end_time');

  if (!hasStartTime && !hasEndTime) {
    throw createAppError('Khong co du lieu de cap nhat', 400);
  }

  if (hasStartTime) {
    result.start_time = normalizeTime(body.start_time);
  }

  if (hasEndTime) {
    result.end_time = normalizeTime(body.end_time);
  }

  return result;
};

module.exports = { validateUpdateTimeSlot };