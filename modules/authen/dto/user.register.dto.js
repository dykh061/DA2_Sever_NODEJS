const {badRequest} = require('../../../common/errors/appError');

// check dữ liệu đầu vào cho việc đăng ký người dùng
class UserRegisterDTO {
   constructor({ email, password }) {

    // kiểm tra email có rỗng hoặc không phải chuỗi không
    if (typeof email !== 'string' || !email){
        throw badRequest("Email is required");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // kiểm tra định dạng email
    if (!emailRegex.test(email)) {
       throw badRequest("Invalid email format");
    }

    if (!password || typeof password !== 'string') {
      throw badRequest("Password is required");
    }

    if (password.length < 6) {
      throw badRequest("Password must be at least 6 characters");
    }
      this.email = email.toLowerCase().trim();
      this.password = password;
    }
}

module.exports = UserRegisterDTO;