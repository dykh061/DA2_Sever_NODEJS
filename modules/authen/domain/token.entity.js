class Token {
  // dai dien du lieu token va key duoc su dung trong auth module
  constructor({
    userId,
    refreshTokenHash,
    publicKey,
    privateKey,
    tokensUsed,
    refreshExpiresAt,
  }) {
    this.userId = userId;
    this.refreshTokenHash = refreshTokenHash;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.tokensUsed = tokensUsed;
    this.refreshExpiresAt = refreshExpiresAt;
  }
}
module.exports = Token;
