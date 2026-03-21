const UserLoginDTO = require("../dto/user.login.dto");
const { comparePassword } = require("../../../common/utils/hash");
const { unauthorized } = require("../../../common/errors/appError");
class UserLoginUseCase {
  // khoi tao use case voi user repository va token service
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  // xu ly luong dang nhap: validate input, kiem tra user, doi chieu password va cap token
  async execute(payload) {
    const { email, password } = payload;
    const dto = new UserLoginDTO({ email, password });

    // tim user theo email

    const user = await this.userRepository.findEmail(dto.email);

    if (!user) {
      throw unauthorized("Email hoac password khong dung");
    }

    // so sanh password

    const isMatch = await comparePassword(dto.password, user.password);

    // neu sai thi tra ve loi
    if (!isMatch) {
      throw unauthorized("Email hoac password khong dung");
    }

    // neu dung thi tao token va tra ve
    const tokens = await this.tokenService.issueTokens({
      userId: user.id,
      email: user.email,
      role: user.role || "user",
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      tokens,
    };
  }
}

module.exports = UserLoginUseCase;
