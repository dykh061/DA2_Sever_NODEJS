class UserRepository {
    async register({email, password, username }) { throw new Error('Not implemented'); }
    async login({ email, password }) { throw new Error('Not implemented'); }
    async logout({ userId }) { throw new Error('Not implemented'); }
    async findEmail(email) { throw new Error('Not implemented'); }
}

module.exports = UserRepository;
