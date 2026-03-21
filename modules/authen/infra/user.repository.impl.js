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

  // placeholder cho logic login neu can trien khai tai tang repository
  async login({ email, password }) {
    // TODO: Implement login logic
  }

  // placeholder cho logic logout neu can trien khai tai tang repository
  async logout({ userId }) {
    // TODO: Implement logout logic
  }

  // tim user theo email de phuc vu dang ky va dang nhap
  async findEmail(email) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email],
    );
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }
}

module.exports = new UserRepoImpl();
