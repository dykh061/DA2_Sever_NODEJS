const { createAppError } = require('../errors/appError');

const parseId = (id) => {
    const parsed = Number(id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw createAppError('ID khong hop le', 400);
    }
    return parsed;
};

module.exports = { parseId };
