const { unauthorized } = require("../../../common/errors/appError");
const TokenService = require("../domain/token.service");
const JwtSecurity = require("../../../common/security/jwt.security");

class TokenServiceImpl extends TokenService {
  // khoi tao token service voi repository va lop bao mat JWT
  constructor(tokenRepository, jwtSecurity = new JwtSecurity()) {
    super();
    this.tokenRepository = tokenRepository;
    this.jwtSecurity = jwtSecurity;
  }

  // tao cap access/refresh token, hash refresh token va luu key vao db
  async issueTokens(payload) {
    const { userId } = payload;
    const { publicKey, privateKey } = await this.jwtSecurity.generateKeyPair();

    const accessToken = this.jwtSecurity.signAccessToken(payload, privateKey);
    const refreshToken = this.jwtSecurity.signRefreshToken(payload, privateKey);

    await this.tokenRepository.saveToken({
      userId,
      publicKey,
      privateKey,
      refreshTokenHash: this.jwtSecurity.hashToken(refreshToken),
    });

    return { accessToken, refreshToken };
  }

  // verify access token bang public key lay tu keystore cua user
  async verifyAccessToken(accessToken) {
    const decodedRaw = this.jwtSecurity.decode(accessToken);

    if (!decodedRaw || !decodedRaw.userId) {
      throw unauthorized("Access token khong hop le");
    }

    const keyStore = await this.tokenRepository.findByUserId(decodedRaw.userId);

    if (!keyStore) {
      throw unauthorized("Khong tim thay key cua user");
    }

    return this.jwtSecurity.verify(accessToken, keyStore.public_key);
  }
}

module.exports = TokenServiceImpl;
