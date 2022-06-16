const express = require('express');

const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.addReview
  )
  .get(reviewController.getAllReviews);

router.route('/:id').get(reviewController.getReview);

module.exports = router;
