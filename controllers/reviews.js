const express=require("express");
const Review = require("../models/reviews.js");
const {reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

module.exports.create=async (req, res) => {
    const listing = await Listing.findById(req.params.id).maxTimeMS(30000);
    const newReview = new Review(req.body.reviews);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Submitted!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.delete=async(req,res)=>{
        let{id,reviewId}=req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}).maxTimeMS(30000);
        await Review.findByIdAndDelete(reviewId).maxTimeMS(30000);
        req.flash("success", "Review Deleted!");
        res.redirect(`/listings/${id}`);
};
