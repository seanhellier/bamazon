SET SQL_SAFE_UPDATES
= 0;
DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
use bamazon_db;
CREATE TABLE products
(
	item_id INTEGER(100) NOT NULL
	AUTO_INCREMENT,

	item VARCHAR
	(50) NOT NULL,

	department VARCHAR
	(50) NOT NULL,

	price DECIMAL
	(10, 2) NOT NULL,
	
	quantity INTEGER
	(100) NOT NULL,

	PRIMARY KEY
	(item_id)
);
	INSERT INTO products
		(item, department, price, quantity)
	VALUES
		("tomato", "food", 3.50, 100),
		("potato", "food", 1.75, 100),
		("cheese", "food", 4.95, 100),
		("hamburger", "food", 5.00, 100),
		("vitaminB", "pharmacy", 8.25, 50),
		("potato chips", "food", 3.75, 100),
		("avocado", "food", 4.50, 50),
		("shampoo", "pharmacy", 8.50, 25),
		("pizza", "deli", 2.70, 25),
		("sphegetti", "food", 1.95, 10),
		("ribeye", "meat", 8.95, 100),
		("dog food", "food", 2.95, 100),
		("tuna", "meat", 1.95, 100),
		("tomato soup", "meat", 8.95, 100),
		("chicken", "meat", 8.95, 3);

	SELECT *
	FROM products;