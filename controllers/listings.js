const Listing = require("../models/listing.js");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req,res)=>{
    let {id} = req.params;
    const listings = await Listing.findById(id)
        .populate({
            path:"reviews",
            populate: {
                path:"author"
            }
        })
        .populate("owner");
        
    if(!listings){
        req.flash('error','The listing you requested does not exist!');
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listings});
};

module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);  // model me data new ha gaya Listing 
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash('success','Listing created successfully!');
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listings = await Listing.findById(id);
    if(!listings){
        req.flash('error','The listing you requested does not exist!');
        return res.redirect("/listings");
    }
    let originalImageUrl = listings.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs",{ listings, originalImageUrl } );
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash('success','Listing updated successfully!');
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    // console.log(deleteListings);
    req.flash('success','Listing deleted successfully!');
    res.redirect("/listings");
};

// Fetch and display listings filtered by the selected category
module.exports.listingsByCategory = async (req, res) => {
    const { categoryName } = req.params;
    const filteredListings = await Listing.find({ category: categoryName });
    if (!filteredListings || filteredListings.length === 0) {
        req.flash('error', `No listings found for category: ${categoryName}`);
        return res.redirect('/listings');
    }
    res.render("listings/index.ejs", { allListings: filteredListings });
};

// Search listings by keyword
module.exports.searchListings = async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        req.flash("error", "Please enter something to search!");
        return res.redirect("/listings");
    }

    const listings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } }
        ]
    });

    if (listings.length === 0) {
        req.flash("error", `No results found for "${q}"`);
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings: listings });
};
