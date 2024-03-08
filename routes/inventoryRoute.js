// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to inventory route

router.get("/detail/:invId", invController.buildByInvId);
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification));
router.get("/management", utilities.handleErrors(invController.buildManagementView));

router.post(
    "/add-inventory",    
    utilities.handleErrors(invController.addingInventory)
)

router.post(
    "/add-classification",    
    utilities.handleErrors(invController.buildAddClassification)
)


 module.exports = router;