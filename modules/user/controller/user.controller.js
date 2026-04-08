const getAllUsersUseCase = require("../usecase/getAllUsers.usecase");
const getUserByIdUseCase = require("../usecase/getUserById.usecase");
const updateUserUseCase = require("../usecase/updateUser.usecase");
const deleteUserUseCase = require("../usecase/deleteUser.usecase");

class UserController {
  async getAll(req, res) {
    try {
      const users = await getAllUsersUseCase.execute();
      const thongTinAnToan = users.map((user) => {
        const { password, ...safeInfo } = user;
        return safeInfo;
      });

      res.status(200).json({
        message: "Lấy thông tin an toàn!",
        data: thongTinAnToan,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res
        .status(statusCode)
        .json({ error: error.message || "Internal server error" });
    }
  }

  async getById(req, res) {
    try {
      const requestedId = req.params.id || req.user.userId;
      const myId = req.user.userId;
      const currentUser = req.user;

      // Check authorization: only allow if requesting own profile or is admin
      if (requestedId != myId && currentUser.role !== "admin") {
        return res.status(403).json({
          error: "Không có quyền truy cập thông tin người dùng này",
        });
      }

      const user = await getUserByIdUseCase.execute(requestedId, currentUser);

      const { password, ...thongTinAnToan } = user;

      res.status(200).json({
        message: "Lấy thông tin an toàn!",
        data: thongTinAnToan,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res
        .status(statusCode)
        .json({ error: error.message || "Internal server error" });
    }
  }

  async update(req, res, next) {
    try {
      const myId = req.user.userId;
      const updateData = req.body;
      const currentUser = req.user; //Thong tin lay tu token

      const updatedUser = await updateUserUseCase.execute(
        myId,
        updateData,
        currentUser,
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res) {
    try {
      await deleteUserUseCase.execute(req.params.id);
      res.status(200).json({ message: "Xoa User thanh cong!" });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res
        .status(statusCode)
        .json({ error: error.message || "Internal server error" });
    }
  }
}

module.exports = new UserController();
