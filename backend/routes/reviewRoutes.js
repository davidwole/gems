const express = require("express");
const router = express.Router();
const {
  getReviews,
  getReview,
  createReview,
  editReview,
  deleteReivew,
  getReviewByUser,
} = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, roleMiddleware(["L1", "L2"]), getReviews);
router.get(
  "/:branch",
  authMiddleware,
  roleMiddleware(["L1", "L2"]),
  getReviews
);
router.get("/:id", authMiddleware, roleMiddleware(["L1", "L2"]), getReview);
router.get(
  "/getuser/:id",
  // authMiddleware,
  // roleMiddleware(["L1", "L2", "L7", "L8"]),
  getReviewByUser
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L7", "L8"]),
  createReview
);
router.patch("/:id", authMiddleware, roleMiddleware(["L1", "L2"]), editReview);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["L1", "L2"]),
  deleteReivew
);

module.exports = router;
