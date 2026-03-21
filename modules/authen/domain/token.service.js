class TokenService {
  // Tạo interface cấp token cho tầng service
  async issueTokens(payload) {
    throw new Error("Not implemented");
  }

  // Tạo interface xác thực access token
  async verifyAccessToken(accessToken) {
    throw new Error("Not implemented");
  }
}

module.exports = TokenService;
