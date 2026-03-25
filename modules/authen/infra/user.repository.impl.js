const db = require("../../../config/database");
const User = require("../domain/user.entity");
const UserRepository = require("../domain/user.repository");

class UserRepoImpl extends UserRepository {
  // tao user moi trong bang users
  async register({ email, password, username }) {
    const [result] = await db.query(
      "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
      [email, password, username],
    );
    return new User({ id: result.insertId, email, password, username });
  }

  // tim user theo email de phuc vu dang ky va dang nhap
  async findEmail(email) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email],
    );
    if (rows.length === 0) return null;
    return new User({
      id: rows[0].id,
      email: rows[0].email,
      password: rows[0].password,
      username: rows[0].username,
      roleId: rows[0].role_id,
    });
  }

  // kiem tra xem role co ton tai trong bang roles hay khong
  async checkRoleByRoleId(roleId) {
    if (!roleId) return "user";

    const [rows] = await db.query("SELECT * FROM roles WHERE id = ? LIMIT 1", [
      roleId,
    ]);

    const roleName = rows[0]?.name;
    return roleName === "admin" ? "admin" : "user";
  }
}

module.exports = new UserRepoImpl();