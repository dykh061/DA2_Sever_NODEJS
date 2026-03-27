class User {
  // dai dien du lieu user su dung xuyen suot trong auth module
  constructor({ id, username, email, password, role, roleId }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.roleId = roleId;
  }
}

module.exports = User;
