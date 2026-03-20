const db = require('../../../config/database');
const User = require('../domain/user.entity');
const UserRepository = require('../domain/user.repository');

class UserRepoImpl extends UserRepository {
    async register({ email, password, username }) {
        const [result] = await db.query('INSERT INTO users (email, password, username) VALUES (?, ?, ?)', [email, password, username]);
        return new User({ id: result.insertId, email, password, username });
    }

    async login({ email, password }) {
       // TODO: Implement login logic
    }

    async logout({ userId }) {
        // TODO: Implement logout logic
    }

    async findEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
        if (rows.length === 0) return null;
        return new User(rows[0]);
    }
}

module.exports = new UserRepoImpl();