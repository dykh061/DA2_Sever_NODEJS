const userRepository = require('../infrastructure/user.repository.impl');
const { validateCreateUser } = require('../dto/createUser.dto');

class CreateUserUseCase {
    async execute(body) {
        const { name } = validateCreateUser(body);
        return await userRepository.create(name);
    }
}

module.exports = new CreateUserUseCase();
