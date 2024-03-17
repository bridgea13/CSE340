/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require('./utilities')
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require('./routes/accountRoute')
const bodyParser = require("body-parser")
const invController = require("./controllers/invController")
const cookieParser = require("cookie-parser")


/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
//week 10
app.use(cookieParser())

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

//week 10
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")


/* ***********************
 * Routes
 *************************/
app.use(static)

//route for javascript
app.use(express.static('public'))

// Route to buildthe management view???
// app.get("/inv/", utilities.handleErrors(invController.buildManagementView));
// app.get("/inventory/", utilities.handleErrors(invController.buildManagementView));
//Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inventory/", require("./routes/inventoryRoute"))
app.use("/inv/", require("./routes/inventoryRoute"))
//app.get("/", utilities.handleErrors(baseController.buildHome));

//account route
app.use("/account", require("./routes/accountRoute"))

//footer 500
app.use("/checkerror", async (req, res, next) => {
  next({status: 500, message: 'HTTP: Error 500'})
})

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'We looked it up on the internet and it says here you have been diagnosed with a 404 error.'})
})   

/*express error handling**/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
