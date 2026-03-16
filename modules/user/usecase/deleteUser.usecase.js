const userRepository = require('../infrastructure/user.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { parseId } = require('../../../common/utils/parseId');

class DeleteUserUseCase {
    async execute(id) {
        const userId = parseId(id);
        const user = await userRepository.findById(userId);
        if (!user) throw createAppError('Khong tim thay User', 404);
        return await userRepository.delete(userId);
    }
}

module.exports = new DeleteUserUseCase();
