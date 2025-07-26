const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userControllers=require("../controllers/users.js");

router.route("/signup")
.get(userControllers.signupForm)
.post(wrapAsync(userControllers.signup));

router.route("/login")
.get(userControllers.loginForm)
.post(savedRedirectUrl,
    passport.authenticate("local",
        {
            failureRedirect: "/login",
            failureFlash: true,
        }),userControllers.login);

router.get("/logout", userControllers.logout);

module.exports = router;