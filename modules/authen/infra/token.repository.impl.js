const db = require("../../../config/database");
const TokenRepository = require("../domain/token.repository");
class TokenRepositoryImpl extends TokenRepository {
  // luu keystore va refresh token hash cua user vao bang tokens
  async saveToken({ userId, publicKey, privateKey, refreshTokenHash }) {
    const sql = `
            INSERT INTO tokens (user_id, refresh_token, public_key, private_key,refresh_expires_at)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                public_key = VALUES(public_key),
                private_key = VALUES(private_key),
                refresh_token = VALUES(refresh_token)
        `; // câu query này sẽ tự động update nếu user đã có token, tránh lỗi duplicate key khi đăng nhập lại và cấp token mới

    return db.query(sql, [
      userId,
      refreshTokenHash,
      publicKey,
      privateKey,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // refresh token có hạn 7 ngày, lưu vào database để kiểm soát thời gian sống của refresh token, có thể dùng để tự động xóa token hết hạn hoặc từ chối cấp token mới khi refresh token đã hết hạn
    ]);
  }

  // tìm bản ghi token theo user id để lấy public key xác thực access token và kiểm tra refresh token hash khi cấp lại token
  async findByUserId(userId) {
    const [rows] = await db.query(
      "SELECT * FROM tokens WHERE user_id = ? LIMIT 1",
      [userId],
    );
    return rows.length ? rows[0] : null;
  }

  // cập nhật refresh token hash mới khi cấp lại token, giữ nguyên cặp public/private key để tránh phải sinh lại cặp khóa mới mỗi lần cấp token
  async updateRefreshTokenHash(userId, refreshTokenHash) {
    return db.query("UPDATE tokens SET refresh_token = ? WHERE user_id = ?", [
      refreshTokenHash,
      userId,
    ]);
  }

  // xóa token của user khi logout hoặc khi refresh token hết hạn
  async deleteByUserId(userId) {
    return db.query("DELETE FROM tokens WHERE user_id = ?", [userId]);
  }
}

module.exports = new TokenRepositoryImpl();
