const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createBranch,
  editBranch,
  getAllBranches,
  getBranchById,
} = require("../controllers/branchController");
const { getUsersByBranch } = require("../controllers/userController");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L3", "L4"]),
  getAllBranches
);
router.get("/:branchId/users", getUsersByBranch);
router.get("/:id", getBranchById);
router.post("/", authMiddleware, roleMiddleware(["L1"]), createBranch);
router.put("/:id", authMiddleware, roleMiddleware(["L1"]), editBranch);

module.exports = router;
