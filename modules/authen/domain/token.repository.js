class TokenRepository {
  // định nghĩa hợp đồng lưu thông tin token và key của user
  async saveToken({
    userId,
    publicKey,
    privateKey,
    refreshTokenHash,
    refreshExpiresAt,
  }) {
    throw new Error("Not implemented");
  }

  // định nghĩa hợp đồng tìm bản ghi token theo user id
  async findByUserId(userId) {
    throw new Error("Not implemented");
  }

  async findRefreshTokenUsed(refreshTokenHash) {
    throw new Error("Not implemented");
  }

  async appendUsedRefreshTokenHash(userId, refreshTokenHash) {
    throw new Error("Not implemented");
  }

  // định nghĩa hợp đồng cập nhật refresh token hash
  async updateRefreshTokenHash(userId, refreshTokenHash) {
    throw new Error("Not implemented");
  }

  // định nghĩa hợp đồng xóa token của user
  async deleteByUserId(userId) {
    throw new Error("Not implemented");
  }
}

module.exports = TokenRepository;
