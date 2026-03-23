const bcrypt = require("bcrypt");
// Số vòng băm để tăng độ bảo mật
const SALT_ROUNDS = 10;

// Hàm băm mật khẩu sử dụng bcrypt
const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

// Hàm so sánh mật khẩu đã băm với mật khẩu gốc
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
