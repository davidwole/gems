const express = require("express");
const router = express.Router();
const handbookController = require("../controllers/handbookController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const multer = require("multer");

// Set up multer for memory storage (we'll store the file in MongoDB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// Get handbook for a branch (public endpoint for viewing)
router.get("/:branchId/:type", handbookController.getHandbook);

// Get handbook metadata (without file data)
router.get(
  "/info/:branchId/:type",
  authMiddleware,
  handbookController.getHandbookInfo
);

// Upload or update handbook (L1 or L2 only)
router.post(
  "/:branchId/:type",
  authMiddleware,
  roleMiddleware(["L1", "L2"]),
  upload.single("handbook"),
  handbookController.uploadHandbook
);

// Delete handbook (L1 only)
router.delete(
  "/:branchId/:type",
  authMiddleware,
  roleMiddleware(["L1"]),
  handbookController.deleteHandbook
);

module.exports = router;
