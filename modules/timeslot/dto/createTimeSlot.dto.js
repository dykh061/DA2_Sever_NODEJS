const { createAppError } = require('../../../common/errors/appError');

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;

const normalizeTime = (value) => {
  if (typeof value !== 'string') {
    throw createAppError('Thoi gian phai la chuoi', 400);
  }

  const raw = value.trim();
  const match = raw.match(TIME_REGEX);

  if (!match) {
    throw createAppError('Thoi gian phai dung dinh dang HH:mm hoac HH:mm:ss', 400);
  }

  const hour = match[1];
  const minute = match[2];
  const second = match[3] || '00';

  return `${hour}:${minute}:${second}`;
};

const toSeconds = (time) => {
  const [h, m, s] = time.split(':').map(Number);
  return h * 3600 + m * 60 + s;
};

const validateCreateTimeSlot = (body) => {
  const start_time = normalizeTime(body?.start_time);
  const end_time = normalizeTime(body?.end_time);

  if (toSeconds(start_time) >= toSeconds(end_time)) {
    throw createAppError('start_time phai nho hon end_time', 400);
  }

  return {
    start_time,
    end_time
  };
};

module.exports = {
  validateCreateTimeSlot,
  normalizeTime,
  toSeconds
};