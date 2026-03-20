const db = require('../../../config/database');
const TokenRepository = require('../domain/token.repository');
class TokenRepositoryImpl extends TokenRepository {
    async saveToken({ userId, publicKey, privateKey, refreshTokenHash }) {
        const sql = `
            INSERT INTO tokens (user_id, refresh_token, public_key, private_key)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                public_key = VALUES(public_key),
                private_key = VALUES(private_key),
                refresh_token = VALUES(refresh_token)
        `;

        return db.query(sql, [userId, refreshTokenHash, publicKey, privateKey]);
    }

    async findByUserId(userId) {
        const [rows] = await db.query(
            'SELECT * FROM tokens WHERE user_id = ? LIMIT 1',
            [userId]
        );
        return rows.length ? rows[0] : null;
    }

    async updateRefreshTokenHash(userId, refreshTokenHash) {
        return db.query(
            'UPDATE tokens SET refresh_token = ? WHERE user_id = ?',
            [refreshTokenHash, userId]
        );
    }

    async deleteByUserId(userId) {
        return db.query('DELETE FROM tokens WHERE user_id = ?', [userId]);
    }
}

module.exports = new TokenRepositoryImpl();

