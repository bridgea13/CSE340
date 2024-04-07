const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  let accountData = req.cookies.accountData;
  res.render("index", {title: "Home", nav})
 req.flash("notice", )
   
}

module.exports = baseController
