const db = require("../../../config/database");
const User = require("../domain/user.entity");
const UserRepository = require("../domain/user.repository");

class UserRepositoryImpl extends UserRepository {
  async findAll() {
    const [rows] = await db.query(
      "SELECT u.*, r.name AS role_name FROM users u JOIN roles r On r.id = u.role_id",
    );
    return rows.map(
      (row) =>
        new User(
          row.id,
          row.username,
          row.email,
          row.password,
          row.phone_number,
        ),
    );
  }

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) return null;
    return new User(
      rows[0].id,
      rows[0].username,
      rows[0].email,
      rows[0].password,
      rows[0].phone_number,
    );
  }

  async update(id, username, email, password, phone_number) {
    await db.query(
      "UPDATE users SET username = ?, email = ?, password = ?, phone_number = ? WHERE id = ?",
      [username, email, password, phone_number, id],
    );
    return new User(id, username, email, password, phone_number);
  }

  async delete(id) {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    return true;
  }
}

module.exports = new UserRepositoryImpl();
