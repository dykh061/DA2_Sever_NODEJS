const userRepository = require('../infrastructure/user.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { parseId } = require('../../../common/utils/parseId');
const { validateUpdateUser } = require('../dto/updateUser.dto');
const { hashPassword } = require('../../../common/utils/hash');

class UpdateUserUseCase {
    async execute(id, body) {
        const userId = parseId(id);
        const { username, email, password, phone_number } = validateUpdateUser(body);
        const user = await userRepository.findById(userId);
        if (!user) throw createAppError('Khong tim thay User', 404);

        let finalPw = user.password;
        if(password) {
            finalPw = await hashPassword(password);
        }

        return await userRepository.update(userId, username,email,finalPw,phone_number);
    }
}

module.exports = new UpdateUserUseCase();
