INSERT INTO account(account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')
RETURNING *;

UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1
RETURNING *;

DELETE FROM account
WHERE account_firstname = 'Tony';

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer'
RETURNING *;

SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory AS i
INNER JOIN classification AS c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

UPDATE inventory
SET 
	inv_image = REPLACE(inv_image, '/ivehicles/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/ivehicles/images', '/images/vehicles');