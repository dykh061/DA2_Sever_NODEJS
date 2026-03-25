const { createAppError } = require('../../../common/errors/appError');

const validateCreateUser = (body) => {
    const { username } = body || {};
    if (typeof username !== 'string' || !username.trim()) {
        throw createAppError('Nhap dung ten', 400);
    }
    return { username: username.trim() };
};

module.exports = { validateCreateUser };
