const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.PoplulateDropdown =async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<select id="classification" name="classification_name" required>' 
  list += '<option value="">Select an option</option>' 
  data.rows.forEach((row) => {   
  list += '<option value="'+ row.classification_id + '">' + row.classification_name + '</option>'  
  })
  list += "</select>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view
* ************************************ */
Util.buildDetailGrid = async function(data){
  let grid
  const vehicle = data.rows[0]
  console.log(vehicle)
  grid =  '<a href="../../inv/detail/'+ vehicle.inv_id 
  + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
  + 'details"><img src="' + vehicle.inv_image 
  +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
  +' on CSE Motors" ></a>'
  grid+="<h2>"+vehicle.inv_make + ' ' + vehicle.inv_model+" Details: </h2>"
  grid += "<h3>Price: "+'<span>$' 
  + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span></h3>'
  grid +="<h4>Description: "+vehicle.inv_description+"</h4>"
  grid +="<h4>Color: "+vehicle.inv_color+"</h4>"
  grid +="<h4>Mileage: "+new Intl.NumberFormat('en-US').format(vehicle.inv_miles) +"</h4>"
  
  return grid
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

 

module.exports = Util