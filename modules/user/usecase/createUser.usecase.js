const userRepository = require('../infrastructure/user.repository.impl');
const { validateCreateUser } = require('../dto/createUser.dto');

class CreateUserUseCase {
    async execute(body) {
        const { username } = validateCreateUser(body);
        return await userRepository.create(username);
    }
}

module.exports = new CreateUserUseCase();
