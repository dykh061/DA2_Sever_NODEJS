class UserRepository {
  // định nghĩa hợp đồng tạo user mới
  async register({ email, password, username }) {
    throw new Error("Not implemented");
  }

  // định nghĩa hợp đồng đăng nhập o tầng repository nếu cần
  async login({ email, password }) {
    throw new Error("Not implemented");
  }

  // định nghĩa hợp đồng logout o tầng repository nếu cần
  async logout({ userId }) {
    throw new Error("Not implemented");
  }

  // định nghĩa hợp đồng tìm user theo email
  async findEmail(email) {
    throw new Error("Not implemented");
  }
}

module.exports = UserRepository;
