const userRepository = require('../repositories/userRepository');

const createAppError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const parseUserId = (id) => {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
        throw createAppError('ID user khong hop le', 400);
    }
    return parsedId;
};

const normalizeName = (name) => {
    if (typeof name !== 'string' || !name.trim()) {
        throw createAppError('Nhap dung ten', 400);
    }
    return name.trim();
};

class UserUseCase {
    async getAllUsers() {
        return await userRepository.findAll();
    }

    async getUserById(id) {
        const userId = parseUserId(id);
        const user = await userRepository.findById(userId);
        if (!user) throw createAppError('Khong tim thay User', 404);
        return user;
    }

    async createUser(name) {
        const normalizedName = normalizeName(name);
        return await userRepository.create(normalizedName);
    }

    async updateUser(id, name) {
        const userId = parseUserId(id);
        const normalizedName = normalizeName(name);
        const user = await userRepository.findById(userId);
        if (!user) throw createAppError('Khong tim thay User', 404);
        return await userRepository.update(userId, normalizedName);
    }

    async deleteUser(id) {
        const userId = parseUserId(id);
        const user = await userRepository.findById(userId);
        if (!user) throw createAppError('Khong tim thay User', 404);
        return await userRepository.delete(userId);
    }
}
module.exports = new UserUseCase();