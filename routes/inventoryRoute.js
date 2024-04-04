// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const regValidate = require('../utilities/inventory-validation')

// const invModel = require("../models/inventory-model")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to inventory route

router.get("/detail/:invId", invController.buildByInvId);
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification));
router.get("/management", utilities.handleErrors(invController.buildManagementView));
router.get("/", utilities.handleErrors(invController.buildManagementView));
router.get("/getInventory/:classificationid", /*utilities.checkAccountType,*/ utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id", /*utilities.checkAccountType,*/ utilities.handleErrors(invController.editInventoryView))
//router.get("/inventory-model", utilities.handleErrors(invModel.getClassifications))
router.get("/delete/:inv_id" ,/*utilities.checkAccountType,*/ utilities.handleErrors(invController.updateInventory))


router.post(
    "/add-inventory", 
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,   
    utilities.handleErrors(invController.addingInventory)
)

router.post(
    "/add-classification",
    regValidate.classificationRules(),
    regValidate.checkClassificationData,    
    utilities.handleErrors(invController.addClassification)
)

router.post(
    "/update/",
    regValidate.inventoryRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

 module.exports = router;