const userRepository = require('../infrastructure/user.repository.impl');
const { createAppError } = require('../../../common/errors/appError');
const { parseId } = require('../../../common/utils/parseId');

class GetUserByIdUseCase {
    async execute(id,currentUser) {
        const targetUserId = parseId(id);
        if (currentUser.userId !== targetUserId && currentUser.role !== 1) {
            throw unauthorized('Bạn không có quyền lấy thông tin của người khác!');
        }
        const user = await userRepository.findById(targetUserId);
        if (!user) throw createAppError('Khong tim thay User', 404);
        return user;
    }
}

module.exports = new GetUserByIdUseCase();
