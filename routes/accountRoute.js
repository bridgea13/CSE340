// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController");
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Define error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Broken!');
};

// route for default view
router.get("/",utilities.checkLogin,  utilities.handleErrors(accountController.accountManagement))

// route for my account to deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// route for register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// route for account route
router.get("/account", utilities.handleErrors(accountController.accountLogin));

// route for admin management view
router.get("/adminManagement", utilities.handleErrors(accountController.buildadminManagement))


// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

//Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)   
)
  
router.post(
    "/adminUpdateAccount",   
    
    utilities.handleErrors(accountController.accountUpdateView)   
)

module.exports = router;