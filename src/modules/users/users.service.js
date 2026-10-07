const prisma = require("../../config/db");
const bcrypt = require("bcryptjs");
const AppError = require("../../utils/AppError");

const getAllUsers = async () => {
  return await prisma.user.findMany({
    where: {
      role: { in: ["TEACHER", "STUDENT"] },
      // isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
  if (!user) throw new AppError("User not found", 404);
  return user;
};

const createUser = async ({ name, email, password, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError("Email already exists", 409);

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
};

const updateUser = async (id, { name, email }) => {
  const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
  if (!user) throw new AppError("User not found", 404);
  if (!user.isActive) throw new AppError("Cannot update an inactive user", 400);

  return await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      ...(name && { name }),
      ...(email && { email }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
};

const deleteUser = async (id) => {
  const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
  if (!user) throw new AppError("User not found", 404);
  if (!user.isActive) throw new AppError("User is already deactivated", 400);

  await prisma.user.update({
    where: { id: parseInt(id) },
    data: { isActive: false },
  });

  return { message: `${user.name} has been deactivated successfully` };
};

const reactivateUser = async (id) => {
  const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
  if (!user) throw new AppError("User not found", 404);
  if (user.isActive) throw new AppError("User is already active", 400);

  await prisma.user.update({
    where: { id: parseInt(id) },
    data: { isActive: true },
  });

  return { message: `${user.name} has been reactivated successfully` };
};

const resetUserPassword = async (id, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
  if (!user) throw new AppError("User not found", 404);
  if (!user.isActive)
    throw new AppError("Cannot reset password for inactive user", 400);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: parseInt(id) },
    data: { password: hashedPassword },
  });

  return { message: `Password reset successfully for ${user.name}` };
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  reactivateUser,
  resetUserPassword,
};
