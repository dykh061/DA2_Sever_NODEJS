const { hashPassword } = require("../../../common/utils/hash");
const { makeDefaultName } = require("../../../common/utils/makeDefaultName");
const { conflict } = require("../../../common/errors/appError");
const UserRegisterDTO = require("../dto/user.register.dto");

class UserRegisterUseCase {
  // khoi tao use case voi user repository va token service
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  // xu ly luong dang ky: validate, tao user moi, va cap token
  async execute(payload) {
    const { email, password } = payload;
    const dto = new UserRegisterDTO({ email, password });
    const existingUser = await this.userRepository.findEmail(dto.email);

    if (existingUser) {
      throw conflict("Email da ton tai");
    }

    const hashedPassword = await hashPassword(dto.password);

    const resolvedUsername = makeDefaultName();

    const createdUser = await this.userRepository.register({
      email: dto.email,
      password: hashedPassword,
      username: resolvedUsername,
    });

    const tokens = await this.tokenService.issueTokens({
      userId: createdUser.id,
      email: createdUser.email,
      role: createdUser.role || "user",
    });

    return {
      user: {
        id: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
      },
      tokens,
    };
  }
}

module.exports = UserRegisterUseCase;
