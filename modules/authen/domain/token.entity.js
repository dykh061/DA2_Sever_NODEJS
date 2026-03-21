class Token {
  // dai dien du lieu token va key duoc su dung trong auth module
  constructor({ userId, refreshToken, publicKey, privateKey }) {
    this.userId = userId;
    this.refreshToken = refreshToken;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }
}
module.exports = Token;
