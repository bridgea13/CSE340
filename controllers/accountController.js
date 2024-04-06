const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const accountCont = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ****************************************
*  Deliver login view
* *************************************** */
accountCont.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

  
/* ****************************************
*  Deliver registration view
* *************************************** */  
accountCont.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountCont.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }  

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,    
    hashedPassword
  )
  
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}
  


/* ****************************************
 *  Process login request
 * ************************************ */
accountCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ****************************************
*  deliver yourloggedin view
* *************************************** */
accountCont.accountManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/accountManagement", {
    title: "Logged In",
    nav,
    errors: null,
  })
}
// accountCont.accountManagement = async function (req, res) {
//   const account_id = res.locals.accountData.account_id;
//   let nav = await utilities.getNav();

//   const accountData = await accountModel.getAccountById(account_id);

//   if (accountData) {
//     res.render("account/accountManagement", {
//       title: "You are Logged in",
//       nav,
//       errors: null,
//       unreadMessages,
//     });
//   } else {
//     req.flash("notice", "sorry unable to login please try again");
//     res.status(501).render("account/login", {
//       title: "Login",
//       nav,
//       errors: null,
//     });
//   }
// }

/* ****************************************
*  deliver adminManagement view
* *************************************** */
accountCont.buildadminManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const accountList = await utilities.buildAccountList();
  res.render("account/adminManagement", {
    title: "Administrative Account Management",
    nav,
    errors: null,
    accountList,
  })
}

/* ****************************************
*  Deliver accountUpdate view
* *************************************** */  
accountCont.accountUpdateView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/updateAccount", {
    title: "Update Account",
    nav,
    errors: null,
  })
}



module.exports = accountCont;