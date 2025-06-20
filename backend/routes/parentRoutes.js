const express = require("express");
const router = express.Router();
const {
  registerParent,
  uploadChildDocuments,
  getUserDocuments,
  deleteDocument,
  getDocumentFile,
} = require("../controllers/parentController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/parents/register
router.post("/register", registerParent);

router.post("/upload_document", authMiddleware, uploadChildDocuments);

// GET /api/parents/documents/:userId
router.get("/documents/:userId", authMiddleware, getUserDocuments);

router.get("/documents/file/:documentId", getDocumentFile);

// DELETE /api/parents/documents/:documentId
router.delete("/documents/:documentId", authMiddleware, deleteDocument);

module.exports = router;
