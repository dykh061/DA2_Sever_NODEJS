/**
 * Abstract repository interface for User domain.
 * Infrastructure layer must extend and implement all methods.
 */
class UserRepository {
    async findAll() { throw new Error('Not implemented'); }
    async findById(id) { throw new Error('Not implemented'); }
    async create(name) { throw new Error('Not implemented'); }
    async update(id, username,email,password, phone_number) { throw new Error('Not implemented'); }
    async delete(id) { throw new Error('Not implemented'); }
}

module.exports = UserRepository;
