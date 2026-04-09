const { createAppError } = require('../../../common/errors/appError');
const { ALLOWED_DAY_TYPES } = require('./createPricing.dto');

const validateUpdatePricing = (body) => {
  const result = {};
  const hasCourtId = Object.prototype.hasOwnProperty.call(body || {}, 'court_id');
  const hasDayType = Object.prototype.hasOwnProperty.call(body || {}, 'day_type');
  const hasPrice = Object.prototype.hasOwnProperty.call(body || {}, 'price');
  const hasTimeSlotId = Object.prototype.hasOwnProperty.call(body || {}, 'time_slot_id');

  if (!hasCourtId && !hasDayType && !hasPrice && !hasTimeSlotId) {
    throw createAppError('Khong co du lieu de cap nhat', 400);
  }

  if (hasCourtId) {
    const court_id = Number(body.court_id);
    if (!Number.isInteger(court_id) || court_id <= 0) {
      throw createAppError('court_id khong hop le', 400);
    }
    result.court_id = court_id;
  }

  if (hasDayType) {
    const day_type =
      typeof body.day_type === 'string' ? body.day_type.trim().toLowerCase() : '';
    if (!ALLOWED_DAY_TYPES.includes(day_type)) {
      throw createAppError('day_type chi duoc la weekday, weekend hoac holiday', 400);
    }
    result.day_type = day_type;
  }

  if (hasPrice) {
    const price = Number(body.price);
    if (Number.isNaN(price) || price < 0) {
      throw createAppError('price khong hop le', 400);
    }
    result.price = price;
  }

  if (hasTimeSlotId) {
    const time_slot_id = Number(body.time_slot_id);
    if (!Number.isInteger(time_slot_id) || time_slot_id <= 0) {
      throw createAppError('time_slot_id khong hop le', 400);
    }
    result.time_slot_id = time_slot_id;
  }

  return result;
};

module.exports = { validateUpdatePricing };