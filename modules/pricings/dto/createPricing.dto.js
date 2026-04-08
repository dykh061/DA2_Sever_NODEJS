const { createAppError } = require('../../../common/errors/appError');

const ALLOWED_DAY_TYPES = ['weekday', 'weekend', 'holiday'];

const validateCreatePricing = (body) => {
  const court_id = Number(body?.court_id);
  const time_slot_id = Number(body?.time_slot_id);
  const price = Number(body?.price);
  const day_type =
    typeof body?.day_type === 'string' ? body.day_type.trim().toLowerCase() : '';

  if (!Number.isInteger(court_id) || court_id <= 0) {
    throw createAppError('court_id khong hop le', 400);
  }

  if (!ALLOWED_DAY_TYPES.includes(day_type)) {
    throw createAppError('day_type chi duoc la weekday, weekend hoac holiday', 400);
  }

  if (Number.isNaN(price) || price < 0) {
    throw createAppError('price khong hop le', 400);
  }

  if (!Number.isInteger(time_slot_id) || time_slot_id <= 0) {
    throw createAppError('time_slot_id khong hop le', 400);
  }

  return {
    court_id,
    day_type,
    price,
    time_slot_id
  };
};

module.exports = { validateCreatePricing, ALLOWED_DAY_TYPES };