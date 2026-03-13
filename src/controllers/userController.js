const userUseCase = require('../use_cases/userUseCase');

class UserController {
    async getAll(req, res) {
        try {
            const users = await userUseCase.getAllUsers();
            res.status(200).json(users);
        }
        catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Internal server error' });
        }
    }

    async getById(req, res) {
        try {
            const user = await userUseCase.getUserById(req.params.id);
            res.status(200).json(user);
        }
        catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Internal server error' });
        }
    }

    async create(req, res) {
        try {
            const { name } = req.body;
            const newUser = await userUseCase.createUser(name);
            res.status(201).json(newUser);
        }
        catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Internal server error' });
        }
    }

    async update(req, res) {
        try {
            const { name } = req.body;
            const updateUser = await userUseCase.updateUser(req.params.id, name);
            res.status(200).json(updateUser);
        }
        catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Internal server error' });
        }
    }

    async delete(req, res) {
        try {
            await userUseCase.deleteUser(req.params.id);
            res.status(200).json({ message: 'Xoa User thanh cong!' });
        }
        catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Internal server error' });
        }
    }
}
module.exports = new UserController();