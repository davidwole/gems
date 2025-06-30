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

router.get("/", getReviews);
router.get("/:id", getReview);
router.post("/", createReview);
router.patch("/:id", authMiddleware, roleMiddleware(["L1", "L2"]), editReview);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["L1", "L2"]),
  deleteReivew
);

module.exports = router;
