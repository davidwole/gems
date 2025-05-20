const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createUser,
  deleteUser,
  getAllUsers,
  toggleUserSuspension,
  upgradeToL5,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(["L1"]), getAllUsers);
router.post(
  "/",
  // authMiddleware, roleMiddleware(["L1"]),
  createUser
);
router.delete("/:id", authMiddleware, roleMiddleware(["L1"]), deleteUser);
router.patch(
  "/:id/suspend",
  authMiddleware,
  roleMiddleware(["L1"]),
  toggleUserSuspension
);
router.patch(
  "/:id/upgrade",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L3"]),
  upgradeToL5
);

module.exports = router;
