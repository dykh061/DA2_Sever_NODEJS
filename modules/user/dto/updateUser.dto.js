const { createAppError } = require('../../../common/errors/appError');

const validateUpdateUser = (body) => {
    const { username , email, password, phone_number } = body || {};
    if (typeof username !== 'string' || !username.trim()) {
        throw createAppError('Nhap dung', 400);
    }
    return { username: username.trim(),
            email : email?.trim(),
            password,
            phone_number: phone_number?.trim()
     };
};

module.exports = { validateUpdateUser };
