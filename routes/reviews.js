const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError');
const {reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const { isLoggedin, isAuthor } = require("../middleware.js");
const reviewsControllers=require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body.reviews);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(errMsg, 400);
    }
    next();
};

router.post("/",isLoggedin,wrapAsync(reviewsControllers.create));

router.delete("/:reviewId",isLoggedin,isAuthor,wrapAsync (reviewsControllers.delete));

module.exports=router;