const express = require("express");
const router = express.Router();
const { registerParent } = require("../controllers/parentController");

// POST /api/parents/register
router.post("/register", registerParent);

module.exports = router;
