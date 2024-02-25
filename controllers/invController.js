const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}
/* ***************************
 *  Build inventory by inv id
 * ************************** */


invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getItemByInvId(inv_id)
  
  const grid = await utilities.buildDetailGrid(data)
  let nav = await utilities.getNav()
  const vehicle = data.rows[0]
  res.render("./inventory/classification", {
    title: vehicle.inv_year+' ' + vehicle.inv_make + ' '+ vehicle.inv_model,
    nav,
    grid,
  })
}
module.exports = invCont