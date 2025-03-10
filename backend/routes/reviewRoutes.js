const express = require("express");
const router = express.Router();
const {
  getReviews,
  getReview,
  createReview,
  editReview,
  deleteReivew,
} = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/:branch",
  authMiddleware,
  roleMiddleware(["L1", "L2"]),
  getReviews
);
router.get("/:id", authMiddleware, roleMiddleware(["L1", "L2"]), getReview);
router.post("/", authMiddleware, roleMiddleware(["L1", "L2"]), createReview);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["L1", "L2"]),
  deleteReivew
);

module.exports = router;
