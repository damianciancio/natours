const Review = require('../models/reviewModel');
// const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    next(
      new AppError(
        `review with id ${req.params.id} not found.`,
        404
      )
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.getAllReviews = catchAsync(
  async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: {
        reviews,
      },
    });
  }
);

exports.addReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
