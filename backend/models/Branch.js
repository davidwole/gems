const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Branch", BranchSchema);
