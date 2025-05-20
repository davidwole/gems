const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  branch: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
