const AuthController = require("./controller/auth.controller");
const UserRegisterUseCase = require("./usecase/user.register.usecase");
const userRepository = require("./infra/user.repository.impl");
const tokenRepository = require("./infra/token.repository.impl");
const TokenServiceImpl = require("./infra/token.service.impl");
const JwtSecurity = require("../../common/security/jwt.security");
const UserLoginUseCase = require("./usecase/user.login.usecase");
const UserLogoutUseCase = require("./usecase/user.logout.usecase");
const UserRefreshTokenUseCase = require("./usecase/user.refreshToken.usecase");

const jwtSecurity = new JwtSecurity();
const tokenService = new TokenServiceImpl(tokenRepository, jwtSecurity);
const registerUseCase = new UserRegisterUseCase(userRepository, tokenService);
const loginUseCase = new UserLoginUseCase(userRepository, tokenService);
const logoutUseCase = new UserLogoutUseCase(tokenRepository);
const refreshTokenUseCase = new UserRefreshTokenUseCase(
  tokenService,
  tokenRepository,
  jwtSecurity,
);
const authController = new AuthController({
  registerUseCase,
  loginUseCase,
  logoutUseCase,
  refreshTokenUseCase,
});

module.exports = {
  authController,
};
