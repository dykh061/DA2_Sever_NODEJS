const { createAppError } = require('../../../common/errors/appError');

const validateUpdateUser = (body) => {
    const { name } = body || {};
    if (typeof name !== 'string' || !name.trim()) {
        throw createAppError('Nhap dung ten', 400);
    }
    return { name: name.trim() };
};

module.exports = { validateUpdateUser };
