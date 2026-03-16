const userRepository = require('../infrastructure/user.repository.impl');

class GetAllUsersUseCase {
    async execute() {
        return await userRepository.findAll();
    }
}

module.exports = new GetAllUsersUseCase();
