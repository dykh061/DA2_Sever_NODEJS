const db = require('../../../config/database');
const User = require('../domain/user.entity');
const UserRepository = require('../domain/user.repository');

class UserRepositoryImpl extends UserRepository {
    async findAll() {
        const [rows] = await db.query('SELECT * FROM users');
        return rows.map((row) => new User(row.id, row.name));
    }

    async findById(id) {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        return new User(rows[0].id, rows[0].name);
    }

    async create(name) {
        const [result] = await db.query('INSERT INTO users (name) VALUES (?)', [name]);
        return new User(result.insertId, name);
    }

    async update(id, name) {
        await db.query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
        return new User(id, name);
    }

    async delete(id) {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        return true;
    }
}

module.exports = new UserRepositoryImpl();
