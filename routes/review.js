const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//required wrapasync folder
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview, isLoggedIn, isReviewaAthor } = require("../middleware.js");

//required controllers
const reviewController = require("../controllers/review.js");


//--------------------Create Review Route-------------------//
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

//------------------Review DELETE Route---------------//
router.delete(
    "/:reviewID",
    isLoggedIn,
    isReviewaAthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;