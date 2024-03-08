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

// get route for my account to deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
//route for register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )
  

module.exports = router;