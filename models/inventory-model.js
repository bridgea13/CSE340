const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    //Console.log(data.rows)
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get inventory item by inv_id
 * ************************** */
async function getItemByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory  
      WHERE inv_id = $1`,
      [inv_id]
    )
    
    return data
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* *****************************
*   add new clasificiation
* *************************** */
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    console.log([classification_name])
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   add new inventory
* *************************** */
async function addInventory(classification_name, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color){
  try {
    const data = await pool.query("SELECT * FROM classification")
    const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) SELECT c.classification_id, $1, $2, $3, $4, $5, $6, $7, $8, $9 FROM classification c WHERE c.classification_name = $10 RETURNING *"
    console.log(data.rows)
    return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
  } catch (error) {
    return error.message
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getItemByInvId, addClassification, addInventory};
