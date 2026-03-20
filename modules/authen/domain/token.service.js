class TokenService {
    async issueTokens(payload) {
        throw new Error('Not implemented');
    }

    async verifyAccessToken(accessToken) {
        throw new Error('Not implemented');
    }
}

module.exports = TokenService;