const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError');
const { listingSchema } = require("../schema.js");
const listing = require("../models/listing.js");
const { isLoggedin, isOwner } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");

const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

router.route("/")
  .get(wrapAsync(listingControllers.index))
  .post(
    isLoggedin,
    // upload.single("Listing[image]"), // ✅ Must match form field
    validateListing,
    wrapAsync(listingControllers.create)
  );


router.get("/new", isLoggedin, listingControllers.new);

router.route("/:id")
  .get(wrapAsync(listingControllers.show))
  .put(
    isLoggedin,
    isOwner,
    upload.single("Listing[image]"), // optional if editing image
    validateListing,
    wrapAsync(listingControllers.update)
  )
  .delete(isLoggedin, isOwner, wrapAsync(listingControllers.delete));

router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingControllers.edit));

module.exports = router;
