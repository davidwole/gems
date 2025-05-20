const Review = require("../models/Review");

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getReviewsByBranch = async (req, res) => {
  try {
    const reviews = await Review.find({ branch: req.params.branch });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getReviewByUser = async (req, res) => {
  try {
    const review = await Review.find({ user: req.body.user });

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const createReview = async (req, res) => {
  try {
    const newReview = await Review.create(req.body);

    res.status(200).json(newReview);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const editReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!review) {
      return res.status(404).json({
        error: "Review not found",
      });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteReivew = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id, req.body);

    res.send("Deleted successfully");
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getReviews,
  getReviewsByBranch,
  getReview,
  getReviewByUser,
  createReview,
  editReview,
  deleteReivew,
};
