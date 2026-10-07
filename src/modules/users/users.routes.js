const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middleware/auth");
const { authorizeRoles } = require("../../middleware/roleCheck");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  reactivateUser,
  resetUserPassword,
} = require("./users.controller");
const validate = require("../../middleware/validate");
const {
  createUserSchema,
  updateUserSchema,
  resetPasswordSchema,
} = require("./users.validation");

router.use(authenticate, authorizeRoles("ADMIN"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", validate(createUserSchema), createUser);
router.put("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", deleteUser);
router.patch("/:id/reactivate", reactivateUser);
router.patch(
  "/:id/reset-password",
  validate(resetPasswordSchema),
  resetUserPassword,
);

module.exports = router;
