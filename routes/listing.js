const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

const wrapAsync = require("../utils/wrapAsync.js");

//required Middleware.js for checkinh logged user
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

//required controllers
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer( { storage } );

// Route to get listings filtered by category
router.get("/category/:categoryName", wrapAsync(listingController.listingsByCategory));

//--INDEX ROUTE--&&--Create Route--//
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        validateListing,
        upload.single('listing[image]'),
        wrapAsync(listingController.createListing)
    );


//NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm);

//--SHOW ROUTE &&--UPDATE ROUTE--&&--DELETE ROUTE//
router
    .route("/:id")
    .get(wrapAsync(listingController.showListings))
    .put(
        isLoggedIn,
        isOwner,
        validateListing,
        upload.single('listing[image]'),
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

//Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;