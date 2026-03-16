const userRepository = require('../infrastructure/user.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { parseId } = require('../../../common/utils/parseId');

class GetUserByIdUseCase {
    async execute(id) {
        const userId = parseId(id);
        const user = await userRepository.findById(userId);
        if (!user) throw createAppError('Khong tim thay User', 404);
        return user;
    }
}

module.exports = new GetUserByIdUseCase();
