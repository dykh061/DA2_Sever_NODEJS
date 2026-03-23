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
  async issueTokens({ userId, email, role }, existingKeyStore = null) {
    const publicKey = existingKeyStore?.publicKey;
    const privateKey = existingKeyStore?.privateKey;
    const keyPair =
      publicKey && privateKey
        ? { publicKey, privateKey }
        : await this.jwtSecurity.generateKeyPair();

    const payload = { userId, email, role };
    const accessToken = this.jwtSecurity.signAccessToken(
      payload,
      keyPair.privateKey,
    );
    const refreshToken = this.jwtSecurity.signRefreshToken(
      payload,
      keyPair.privateKey,
    );

    const refreshTokenHash = this.jwtSecurity.hashToken(refreshToken);

    await this.tokenRepository.saveToken({
      userId,
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      refreshTokenHash,
      refreshExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  }

  // verify token, tim keystore theo userId va tra ve payload cung keystore de cac usecase tai su dung
  async verifyTokenAndGetKeyStore(token) {
    const decodedRaw = this.jwtSecurity.decode(token);

    if (!decodedRaw || !decodedRaw.userId) {
      throw unauthorized("Token khong hop le");
    }

    const keyStore = await this.tokenRepository.findByUserId(decodedRaw.userId);

    if (!keyStore) {
      throw unauthorized("Khong tim thay key cua user");
    }

    const decoded = this.jwtSecurity.verify(token, keyStore.publicKey);
    return { decoded, keyStore };
  }

  // verify access token, neu hop le thi tra ve payload da giai ma, neu khong hop le thi nem loi 401
  async verifyAccessToken(accessToken) {
    const { decoded } = await this.verifyTokenAndGetKeyStore(accessToken);
    return decoded;
  }
}

module.exports = TokenServiceImpl;
