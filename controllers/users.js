const express = require("express");
const User = require("../models/user.js");

module.exports.signupForm=(req, res) => {
    res.render("./user/signup.ejs");
};

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password); // ✅ Await here
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome To Wanderlust!");
            return res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("/signup");
    }
};

module.exports.loginForm=(req, res) => {
    res.render("./user/login.ejs");
};

module.exports.login=async (req, res) => {
        req.flash("success", "Welcome Again!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
};

module.exports.logout=(req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfully Logout!");
        res.redirect("/listings");
    });
};