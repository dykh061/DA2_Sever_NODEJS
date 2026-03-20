class AuthController {
    constructor({ registerUseCase }) {
        this.registerUseCase = registerUseCase;
    }

    async register(req, res) {
        try {
            const result = await this.registerUseCase.execute(req.body);
            return res.status(201).json(result);
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({ error: error.message || 'Internal server error' });
        }
    }
}

module.exports = AuthController;
