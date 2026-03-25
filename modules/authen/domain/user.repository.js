class UserRepository {
  // định nghĩa hợp đồng tạo user mới
  async register({ email, password, username }) {
    throw new Error("Not implemented");
  }

  // định nghĩa hợp đồng tìm user theo email
  async findEmail(email) {
    throw new Error("Not implemented");
  }
  async checkRoleByRoleId(roleId) {
    throw new Error("Not implemented");
  }
}

module.exports = UserRepository;