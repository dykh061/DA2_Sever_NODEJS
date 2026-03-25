const getAllUsersUseCase = require('../usecase/getAllUsers.usecase');
const getUserByIdUseCase = require('../usecase/getUserById.usecase');
const createUserUseCase = require('../usecase/createUser.usecase');
const updateUserUseCase = require('../usecase/updateUser.usecase');
const deleteUserUseCase = require('../usecase/deleteUser.usecase');


class UserController {
    async getAll(req, res) {
        try {
            const users = await getAllUsersUseCase.execute();
            res.status(200).json(users);
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Internal server error' });
        }
    }

    async getById(req, res) {
        try {
            const user = await getUserByIdUseCase.execute(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Internal server error' });
        }
    }

    async create(req, res) {
        try {
            const newUser = await createUserUseCase.execute(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Internal server error' });
        }
    }

    async update(req, res, next) {
        try {
            const myId = req.user.userId;
            const updateData = req.body;
            const currentUser = req.user; //Thong tin lay tu token

            const updatedUser = await updateUserUseCase.execute(myId, updateData, currentUser);
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res) {
        try {
            await deleteUserUseCase.execute(req.params.id);
            res.status(200).json({ message: 'Xoa User thanh cong!' });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Internal server error' });
        }
    }
}

module.exports = new UserController();
