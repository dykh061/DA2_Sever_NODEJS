class UserLogoutUseCase {
  constructor(tokenRepository) {
    this.tokenRepository = tokenRepository;
  }
  async execute({ userId }) {
    const result = await this.tokenRepository.deleteByUserId(userId);
    return result;
  }
}

module.exports = UserLogoutUseCase;