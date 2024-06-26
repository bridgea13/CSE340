const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ****************************************
 *  Deliver inventory management view
 * *************************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classList = await utilities.buildClassificationList();
  //classList is == to classificationSelect from tutorial
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classList,
  });
};

/* ****************************************
 *  Deliver add classification view
 * *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: null,
  });
};

/* ****************************************
 *  Deliver add inventory view
 * *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classList,
    errors: null,
  });
};

/* ***************************
 *  Build inventory by inv id
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getItemByInvId(inv_id);
  //console.log(data.json)
  const grid = await utilities.buildDetailGrid(data);
  let nav = await utilities.getNav();
  const vehicle = data.rows[0];
  res.render("./inventory/classification", {
    title: vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model,
    nav,
    grid,
    errors: null,
  });
};

/* ****************************************
 *  Process adding new inventory
 * *************************************** */
invCont.addingInventory = async function (req, res) {
  let nav = await utilities.getNav();
  let classList = await utilities.buildClassificationList();
  const {
    classification_name,
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  const addInvResult = await invModel.addInventory(
    classification_name,
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );

  if (addInvResult) {
    req.flash("notice", `Congratulations, you added new inventory.`);
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classList,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the process failed.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classList,
      errors: null,
    });
  }
};

/* ****************************************
 *  Process adding new classification
 * *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  let classList = await utilities.buildClassificationList();
  const classResult = await invModel.addClassification(classification_name);

  if (classResult != null) {
    req.flash("notice", `Congratulations, you added a new classification.`);
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classList,
      errors: null,
    });
  } else {
    const enteredClassification = req.body.classification_name;
    req.flash("notice", "Sorry, the classification failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name: enteredClassification,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classificationid);

  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );

  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ****************************************
 *  Process to build update inventory view
 * *************************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const vehicle = await invModel.getItemByInvId(inv_id);
  const itemData = vehicle.rows[0];
  let classList = await utilities.buildClassificationList();
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classList: classList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classList = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classList: classList,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ****************************************
 *  Process to build delete confirmation view
 * *************************************** */
invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  let itemData = await invModel.getItemByInvId(inv_id);
itemData = itemData.rows[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  console.log("******here");
  console.log(itemData);
  res.render("./inventory/delete-confirmation", {
    title: "Delete " + itemName,
    nav,

    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,

    inv_price: itemData.inv_price,

    // classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  const {
    
    inv_make,
    inv_model,
    
  } = req.body;
  const itemName = `${inv_make} ${inv_model}`;
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id);

  const deleteResult = await invModel.deleteInventoryItem(inv_id);

  if (deleteResult) {
    req.flash("notice", `The ${itemName} was successfully deleted.`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.redirect("inventory/delete/inv_id");
  }
};

module.exports = invCont;
