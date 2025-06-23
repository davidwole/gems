const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
