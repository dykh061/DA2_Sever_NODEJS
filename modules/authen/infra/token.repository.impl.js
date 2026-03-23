const db = require("../../../config/database");
const TokenRepository = require("../domain/token.repository");
const Token = require("../domain/token.entity");

function toTokenEntity(row) {
  if (!row) return null;
  return new Token({
    userId: row.user_id,
    refreshTokenHash: row.refresh_token_hash,
    publicKey: row.public_key,
    privateKey: row.private_key,
    tokensUsed: row.tokens_used,
    refreshExpiresAt: row.refresh_expires_at,
  });
}

class TokenRepositoryImpl extends TokenRepository {
  // luu keystore va refresh token hash cua user vao bang tokens
  async saveToken({
    userId,
    publicKey,
    privateKey,
    refreshTokenHash,
    refreshExpiresAt,
  }) {
    const sql = `
      INSERT INTO tokens (user_id, public_key, private_key, refresh_token_hash, refresh_expires_at, tokens_used)
      VALUES (?, ?, ?, ?, ?, JSON_ARRAY())
      ON DUPLICATE KEY UPDATE
        public_key = VALUES(public_key),
        private_key = VALUES(private_key),
        refresh_token_hash = VALUES(refresh_token_hash),
        refresh_expires_at = VALUES(refresh_expires_at)
    `; // câu query này sẽ tự động update nếu user đã có token, tránh lỗi duplicate key khi đăng nhập lại và cấp token mới

    return db.query(sql, [
      userId,
      publicKey,
      privateKey,
      refreshTokenHash,
      refreshExpiresAt,
    ]);
  }

  // tìm bản ghi token theo user id để lấy public key xác thực access token và kiểm tra refresh token hash khi cấp lại token
  async findByUserId(userId) {
    const [rows] = await db.query(
      "SELECT * FROM tokens WHERE user_id = ? LIMIT 1",
      [userId],
    );
    return rows.length ? toTokenEntity(rows[0]) : null;
  }

  // cập nhật refresh token hash mới khi cấp lại token, giữ nguyên cặp public/private key để tránh phải sinh lại cặp khóa mới mỗi lần cấp token
  async updateRefreshTokenHash(userId, refreshTokenHash) {
    return db.query(
      "UPDATE tokens SET refresh_token_hash = ? WHERE user_id = ?",
      [refreshTokenHash, userId],
    );
  }

  // xóa token của user khi logout hoặc khi refresh token hết hạn
  async deleteByUserId(userId) {
    return db.query("DELETE FROM tokens WHERE user_id = ?", [userId]);
  }

  // Tìm bản ghi token theo hash của refresh token đã sử dụng để kiểm tra xem refresh token đã bị sử dụng lại hay chưa,
  //  nếu đã bị sử dụng sẽ từ chối cấp token mới để ngăn chặn tấn công replay attack
  async findRefreshTokenUsed(refreshTokenHash) {
    const sql = `
    SELECT * 
    FROM tokens 
    WHERE JSON_CONTAINS(tokens_used, JSON_QUOTE(?))
  `;
    const [rows] = await db.query(sql, [refreshTokenHash]);
    return rows.map(toTokenEntity);
  }

  // Thêm hash của refresh token đã sử dụng vào trường tokens_used để
  // lưu lịch sử các refresh token đã bị sử dụng,
  async appendUsedRefreshTokenHash(userId, refreshTokenHash) {
    const sql = `
      UPDATE tokens
      SET tokens_used = JSON_ARRAY_APPEND(
        COALESCE(tokens_used, JSON_ARRAY()),
        '$',
        JSON_QUOTE(?)
      )
      WHERE user_id = ?
    `;
    return db.query(sql, [refreshTokenHash, userId]);
  }
}

module.exports = new TokenRepositoryImpl();
