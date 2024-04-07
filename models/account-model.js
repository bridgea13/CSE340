const pool = require("../database/")
// const accountModel = require('../models/account-model.js')
/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    console.log([account_firstname, account_lastname, account_email, account_password])
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Get accounts
* ***************************** */
async function getAccounts() {
  return await pool.query(
    "SELECT * FROM public.account ORDER BY account_type"
  );
}

/* *****************************
* Get account by account id
* ***************************** */
async function getAccountById (account_id) {
 
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account id found")
  }
}

/* *****************************
*   updated account any account via Admin console
* *************************** */
async function updateAccount(account_firstname, account_lastname, account_email, account_type, accountId){
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3,  account_type = $4 WHERE account_id = $5 RETURNING *";
    console.log([account_firstname, account_lastname, account_email])
    return await pool.query(sql, [account_firstname, account_lastname, account_email,  account_type, accountId])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   updated account my account 
* *************************** */
async function updateMyAccount(account_firstname, account_lastname, account_email, accountId){
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3  WHERE account_id = $4 RETURNING *";
    console.log([account_firstname, account_lastname, account_email, accountId])
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_type, accountId])
  } catch (error) {
    return error.message
  }
}


module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccounts, getAccountById, updateAccount, updateMyAccount};