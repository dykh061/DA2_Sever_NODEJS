const { unauthorized } = require('../../../common/errors/appError');
const TokenService = require('../domain/token.service');
const JwtSecurity = require('../../../common/security/jwt.security');

class TokenServiceImpl extends TokenService {
    constructor(tokenRepository, jwtSecurity = new JwtSecurity()) {
        super();
        this.tokenRepository = tokenRepository;
        this.jwtSecurity = jwtSecurity;
    }

    async issueTokens(payload) {
        const { userId } = payload;
        const { publicKey, privateKey } = this.jwtSecurity.generateKeyPair();

        const accessToken = this.jwtSecurity.signAccessToken(payload, privateKey);
        const refreshToken = this.jwtSecurity.signRefreshToken(payload, privateKey);

        await this.tokenRepository.saveToken({
            userId,
            publicKey,
            privateKey,
            refreshTokenHash: this.jwtSecurity.hashToken(refreshToken)
        });

        return { accessToken, refreshToken };
    }

    async verifyAccessToken(accessToken) {
        const decodedRaw = this.jwtSecurity.decode(accessToken);

        if (!decodedRaw || !decodedRaw.userId) {
            throw unauthorized('Access token khong hop le');
        }

        const keyStore = await this.tokenRepository.findByUserId(decodedRaw.userId);

        if (!keyStore) {
            throw unauthorized('Khong tim thay key cua user');
        }

        return this.jwtSecurity.verify(accessToken, keyStore.public_key);
    }
}

module.exports = TokenServiceImpl;