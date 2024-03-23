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

/* ****************************************
*  Deliver inventory management view
* *************************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.PoplulateDropdown()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,    
    errors: null,
    classificationSelect,
  })
}

/* ****************************************
*  Deliver add classification view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver add inventory view
* *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.PoplulateDropdown()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  })
}


/* ***************************
 *  Build inventory by inv id
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getItemByInvId(inv_id)
  console.log(data.json)
  const grid = await utilities.buildDetailGrid(data)
  let nav = await utilities.getNav()
  const vehicle = data.rows[0]
  res.render("./inventory/classification", {
    title: vehicle.inv_year+' ' + vehicle.inv_make + ' '+ vehicle.inv_model,
    nav,
    grid,
  })
}

/* ****************************************
*  Process adding new inventory
* *************************************** */
invCont.addingInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classList = await utilities.PoplulateDropdown()
  const { classification_name, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  
  const addInvResult = await invModel.addInventory(classification_name, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
  )

  if (addInvResult) {
    req.flash(
      "notice",
      `Congratulations, you added new inventory.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      
    })
  } else {
    req.flash("notice", "Sorry, the process failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classList,
      errors: null,
    })
  }
}

/* ****************************************
*  Process adding new classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const {classification_name} = req.body
  
  const classResult = await invModel.addClassification(
    classification_name
  )
  
  if (classResult!= null) {
    req.flash(
      "notice",
      `Congratulations, you added a new classification.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classificationid)
  
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ****************************************
*  Process to build update inventory view
* *************************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.PoplulateDropdown()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  })
}



module.exports = invCont