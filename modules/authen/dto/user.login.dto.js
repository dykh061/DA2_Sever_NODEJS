const { badRequest } = require("../../../common/errors/appError");

class UserLoginDTO {
  // validate du lieu dau vao cua dang nhap va chuan hoa email
  constructor({ email, password }) {
    if (typeof email !== "string" || !email) {
      throw badRequest("Email khong hop le");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw badRequest("Dinh dang email khong hop le");
    }
    if (!password || typeof password !== "string") {
      throw badRequest("Password khong hop le");
    }
    this.email = email.toLocaleLowerCase().trim();
    this.password = password;
  }
}

module.exports = UserLoginDTO;
