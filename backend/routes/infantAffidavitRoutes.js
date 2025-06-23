// routes/infantAffidavitRoutes.js
const express = require("express");
const {
  createInfantAffidavit,
  getInfantAffidavits,
  getInfantAffidavitByUser,
  updateInfantAffidavit,
  deleteInfantAffidavit,
} = require("../controllers/affidavitController");

const router = express.Router();

// @route   POST /api/infant-affidavits
// @desc    Create a new infant affidavit
// @access  Private
router.post("/", createInfantAffidavit);

// @route   GET /api/infant-affidavits
// @desc    Get all infant affidavits for a user
// @access  Private
// router.get("/", getInfantAffidavits);

// @route   GET /api/infant-affidavits/:id
// @desc    Get a single infant affidavit by ID
// @access  Private
router.get("/:id", getInfantAffidavitByUser);

// @route   PUT /api/infant-affidavits/:id
// @desc    Update an infant affidavit
// @access  Private
router.put("/:id", updateInfantAffidavit);

// @route   DELETE /api/infant-affidavits/:id
// @desc    Delete an infant affidavit
// @access  Private
router.delete("/:id", deleteInfantAffidavit);

module.exports = router;
