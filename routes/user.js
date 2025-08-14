const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

//required wrapasync folder
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
//required controllers
const userController = require("../controllers/user.js");

//signup route
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(
        wrapAsync(userController.signup)
    );

//Login route
router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl, 
        passport.authenticate("local", { 
            failureRedirect: "/login",
            failureFlash: true 
        }), 
        userController.login
    );

//------------Logout route--------------//
router.get("/logout",userController.logout);


module.exports = router;