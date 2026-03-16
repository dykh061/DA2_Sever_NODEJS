const userRepository = require('../infrastructure/user.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { parseId } = require('../../../common/utils/parseId');
const { validateUpdateUser } = require('../dto/updateUser.dto');

class UpdateUserUseCase {
    async execute(id, body) {
        const userId = parseId(id);
        const { name } = validateUpdateUser(body);
        const user = await userRepository.findById(userId);
        if (!user) throw createAppError('Khong tim thay User', 404);
        return await userRepository.update(userId, name);
    }
}

module.exports = new UpdateUserUseCase();
