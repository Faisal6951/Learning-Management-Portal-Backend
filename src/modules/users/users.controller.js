const usersService = require("./users.service");
const asyncHandler = require("../../utils/asyncHandler");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await usersService.getAllUsers();
  res.status(200).json({ success: true, data: users });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await usersService.getUserById(req.params.id);
  res.status(200).json({ success: true, data: user });
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Name, email, password and role are required",
    });
  }

  if (!["TEACHER", "STUDENT"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Role must be either TEACHER or STUDENT",
    });
  }

  const user = await usersService.createUser({ name, email, password, role });
  res
    .status(201)
    .json({ success: true, message: "User created successfully", data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await usersService.updateUser(req.params.id, req.body);
  res
    .status(200)
    .json({ success: true, message: "User updated successfully", data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  const result = await usersService.deleteUser(req.params.id);
  res.status(200).json({ success: true, message: result.message });
});

const reactivateUser = asyncHandler(async (req, res) => {
  const result = await usersService.reactivateUser(req.params.id);
  res.status(200).json({ success: true, message: result.message });
});

const resetUserPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({
      success: false,
      message: "New password is required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  const result = await usersService.resetUserPassword(
    req.params.id,
    newPassword,
  );
  res.status(200).json({ success: true, message: result.message });
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  reactivateUser,
  resetUserPassword,
};
