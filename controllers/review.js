const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req,res) => {
    let listings = await Listing.findById(req.params.id);
    if (!listings) {
        throw new ExpressError(404, "Listing not found");
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listings.reviews.push(newReview);

    await newReview.save();
    await listings.save();
    req.flash('success','Review submitted successfully!');

    res.redirect(`/listings/${listings._id}`);
};

module.exports.destroyReview = async(req,res) => {
    let {id, reviewID} =req.params;
    await Listing.findByIdAndUpdate(id,{$pull: { reviews:reviewID } } );
    await Review.findByIdAndDelete(reviewID);
    req.flash('success','Review deleted successfully!');
    res.redirect(`/listings/${id}`);
};