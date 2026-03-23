class TokenService {
  // Tạo interface cấp token cho tầng service, tự động sinh key pair và save token vào DB
  async issueTokens({ userId, email, role }, existingKeyStore = null) {
    throw new Error("Not implemented");
  }

  // Tạo interface xác thực token và lấy keystore theo userId
  async verifyTokenAndGetKeyStore(token) {
    throw new Error("Not implemented");
  }

  // Tạo interface xác thực access token
  async verifyAccessToken(accessToken) {
    throw new Error("Not implemented");
  }
}

module.exports = TokenService;
