const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");

const generateKeyPairAsync = promisify(crypto.generateKeyPair);

class JwtSecurity {
  // hàm tạo cặp khóa pub và priv để dùng kí và xác thực token
  async generateKeyPair() {
    const { publicKey, privateKey } = await generateKeyPairAsync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    return { publicKey, privateKey };
  }

  // hàm hash token để lưu vào database, tránh lưu token gốc
  hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  // hàm kí access Token với private key, token có thời gian sống ngắn
  signAccessToken(payload, privateKey) {
    return jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    });
  }

  // hàm kí refresh Token với private key, token có thời gian sống dài hơn
  signRefreshToken(payload, privateKey) {
    return jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
    });
  }

  // hàm giải mã token mà không cần xác thực, dùng để lấy userId từ token
  decode(token) {
    return jwt.decode(token);
  }

  // hàm xác thực token với public key, trả về payload nếu token hợp lệ hoặc ném lỗi nếu không
  verify(token, publicKey) {
    return jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    });
  }
}

module.exports = JwtSecurity;
