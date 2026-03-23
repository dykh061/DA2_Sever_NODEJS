const userRepository = require('../infrastructure/user.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { parseId } = require('../../../common/utils/parseId');
const { validateUpdateUser } = require('../dto/updateUser.dto');
const { hashPassword } = require('../../../common/utils/hash');
const { unauthorized } = require('../../../common/errors/appError');

class UpdateUserUseCase {
    async execute(id, body, currentUser) {
        const targetUserId = parseId(id);
        if (currentUser.userId !== targetUserId && currentUser.role !== 1) {
            throw unauthorized('Bạn không có quyền sửa thông tin của người khác!');
        }

        const { username, email, password, phone_number } = validateUpdateUser(body);
        const user = await userRepository.findById(targetUserId);
        if (!user) throw createAppError('Khong tim thay User', 404);

        let finalPw = user.password;
        if (password) {
            finalPw = await hashPassword(password);
        }

        return await userRepository.update(targetUserId, username, email, finalPw, phone_number);
    }
}

module.exports = new UpdateUserUseCase();
