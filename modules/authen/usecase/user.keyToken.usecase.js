class KeyTokenUseCase {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }

    async issueTokens(payload) {
        return this.tokenService.issueTokens(payload);
    }

    async verifyAccessToken(accessToken) {
        return this.tokenService.verifyAccessToken(accessToken);
    }
}

module.exports = KeyTokenUseCase;