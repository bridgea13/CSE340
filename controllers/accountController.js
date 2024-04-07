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
      errors: null,
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
  //res.cookie('accountData', accountData, { maxAge: 3600 * 1000, httpOnly: true })
   
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
  //let accountData = req.cookies.accountData;
  const token = req.cookies.jwt;
  const accountData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET )
  
  
  res.render("account/accountManagement", {
    title: "Logged In",
    nav,
    errors: null,
    accountType: accountData.account_type,
    firstName: accountData.account_firstname,
  })
}


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
*  Deliver accountUpdate  for administration view
* *************************************** */  
accountCont.accountUpdateView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const accountId = req.body.account_id;
  const account = await accountModel.getAccountById(accountId)
  
  res.render("account/updateAccount", {
    title: "Update Account",
    nav,
    accountId: accountId,
    account_firstname:account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    account_type: account.account_type,
    errors: null,
  })
}
accountCont.buildYourManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  // const accountId = req.body.account_id;
  // const account = await accountModel.getAccountById(accountId)
  const token = req.cookies.jwt;
  if (req.cookies.jwt){
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  console.log(decoded);
  const account = decoded;
  res.render("account/yourAccountUpdate", {
    title: "Update Account",
    nav,
    accountId: account.account_id,
    account_firstname:account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    errors: null,
  })}
}
/* ****************************************
*  Deliver accountUpdate  for administration view
* *************************************** */  
accountCont.accountUpdateView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const accountId = req.body.account_id;
  const account = await accountModel.getAccountById(accountId)
  
  res.render("account/updateAccount", {
    title: "Update Account",
    nav,
    accountId: accountId,
    account_firstname:account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    account_type: account.account_type,
    errors: null,
  })
}
/* ****************************************
*  Deliver accountUpdate  for my account
* *************************************** */  
accountCont.myAccountUpdated = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email,  accountId } = req.body
  const accountList = await utilities.buildAccountList();
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  console.log(accountId)
  const updateResult = await accountModel.updateMyAccount(
    account_firstname,
    account_lastname,
    account_email, 
    accountId,
  )
  
  
  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, your'e account has been updated.`
    )
    res.status(201).redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/updateAccount", {
      title: "Update Account",
      nav,
      accountId: accountId,
      account_firstname:account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
      account_type: account_type,
      errors: null,
    })
  }
}

/* ****************************************
*  Deliver manegmentview for one manegmentg
* *************************************** */  
accountCont.buildYourManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  // const accountId = req.body.account_id;
  // const account = await accountModel.getAccountById(accountId)
  const token = req.cookies.jwt;
  if (req.cookies.jwt){
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  console.log(decoded);
  const account = decoded;
  res.render("account/yourAccountUpdate", {
    title: "Update Account",
    nav,
    accountId: account.account_id,
    account_firstname:account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    errors: null,
  })}
}
/* ****************************************
*  Process account updated
* *************************************** */
accountCont.accountUpdated = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_type,  accountId } = req.body
  const accountList = await utilities.buildAccountList();
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email, 
    account_type,   
    accountId,
  )
  
  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve updated ${account_firstname}.`
    )
    res.status(201).render("account/adminManagement", {
      title: "Administrative Account Management",
     nav,
     errors: null,
     accountList,

    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/adminManagement", {
      title: "Administrative Account Management",
     nav,
     errors: null,
     accountList,
    })
  }
}
accountCont.logout = (req, res)=> {
  res.clearCookie('jwt');
  res.redirect('/account/login');
}
module.exports = accountCont;