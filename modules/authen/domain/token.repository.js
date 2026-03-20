class TokenRepository {
    async saveToken({ userId, publicKey, privateKey, refreshTokenHash }) {
        throw new Error('Not implemented');
    }

    async findByUserId(userId) {
        throw new Error('Not implemented');
    }

    async updateRefreshTokenHash(userId, refreshTokenHash) {
        throw new Error('Not implemented');
    }

    async deleteByUserId(userId) {
        throw new Error('Not implemented');
    }
}

module.exports = TokenRepository;