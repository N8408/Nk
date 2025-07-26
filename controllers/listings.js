const express = require("express");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

// Show all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}).maxTimeMS(30000);
    res.render("listings/index.ejs", { allListings });
};

// Render form to create new listing
module.exports.new = (req, res) => {
    res.render("listings/new.ejs");
};

// Show single listing
module.exports.show = async (req, res) => {
    let { id } = req.params;
    const details = await Listing.findById(id).maxTimeMS(30000)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!details) {
        req.flash("error", "Listing you are looking for does not exist.");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { details });
};

// Create new listing
module.exports.create = async (req, res, next) => {
    const { listing } = req.body;

    // Default image if none provided
    if (!listing.image || listing.image.trim() === "") {
        listing.image = "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
    }

    const newListing = new Listing(listing);
    newListing.owner = req.user._id;

    try {
        await newListing.save();
        req.flash("success", "New Listing Saved!");
        res.redirect(`/listings/${newListing._id}`);
    } catch (err) {
        next(err); // Handle validation errors (e.g., missing title)
    }
};




// Render edit form
module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const details = await Listing.findById(id).maxTimeMS(30000);

    if (!details) {
        req.flash("error", "Listing you are looking for does not exist.");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { details });
};

// Update listing
module.exports.update = async (req, res) => {
    let { id } = req.params;
    const { Listing: updatedData } = req.body; // ✅ Capital "L"
    const updatedListing = await Listing.findByIdAndUpdate(id, updatedData).maxTimeMS(30000);

    // Optional: handle image update if needed
    // if (req.file) {
    //     updatedListing.image = {
    //         url: req.file.path,
    //         filename: req.file.filename
    //     };
    //     await updatedListing.save();
    // }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// Delete listing
module.exports.delete = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id).maxTimeMS(30000);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
