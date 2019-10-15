var inquirer = require('inquirer');
var mysql = require('mysql');
var colors = require('colors');
require('console.table');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'bamazon_db',
	password: '70-Mousey_05'
});

connection.connect(function(err) {
	if (err) throw err;
	console.log('connected as id ' + connection.threadId);
	// afterConnection();
});

var correct = true;

var mgmtOperationsList = function() {
	inquirer
		.prompt([
			{
				name: 'mgmt',
				type: 'list',
				message: 'Select Mgmt Function.',
				choices: [ 'View Inventory', 'View Low Inventory', 'Add Item to Inventory', 'Add New Item', 'Quit' ]
			}
		])
		.then(function(answers) {
			switch (answers.mgmt) {
				case 'View Inventory':
					viewItems();
					break;
				case 'View Low Inventory':
					ViewLowInventory();
					break;
				case 'Add Item to Inventory':
					AddItem();
					break;
				case 'Add New Item':
					AddNewItem();
					break;
				case 'Quit':
					process.exit();
			}
		});
};

// View Items
var viewItems = function() {
	var tableArr = [];
	var tableCols = function(item_id, item, department, price, quantity) {
		this.item_id = item_id;
		this.item = item;
		this.department = department;
		this.price = price;
		this.stockquantity = quantity;
	};
	connection.query('SELECT * FROM products', function(err, res) {
		for (var i = 0; i < res.length; i++) {
			tableArr.push(
				new tableCols(res[i].item_id, res[i].item, res[i].department, res[i].price.toFixed(2), res[i].quantity)
			);
		}
		// console.log('viewItems works');
		console.table(tableArr);
		mgmtOperationsList();
	});
};

// view low inventory
var ViewLowInventory = function() {
	var tableArr = [];
	var tableCols = function(item_id, item, department, price, quantity) {
		this.item_id = item_id;
		this.item = item;
		this.department = department;
		this.price = price;
		this.quantity = quantity;
	}; // end constructor
	connection.query('SELECT * FROM products WHERE quantity < 5', function(err, res) {
		if (err) throw err;
		if (res.length < 1) {
			console.log('All products have 5 or more items in stock.');
		} else {
			for (var i = 0; i < res.length; i++) {
				tableArr.push(
					new tableCols(
						res[i].item_id,
						res[i].item,
						res[i].department,
						res[i].price.toFixed(2),
						res[i].quantity
					)
				);
			}
			// console.log();
			console.table(tableArr);
		}
		mgmtOperationsList();
	});
};

// ADD Items
var AddItem = function() {
	var tableArr = [];
	var tableCols = function(item_id, item, department, price, quantity) {
		this.item_id = item_id;
		this.item = item;
		this.department = department;
		this.price = price;
		this.quantity = quantity;
	};
	connection.query('SELECT * FROM products', function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			tableArr.push(
				new tableCols(res[i].item_id, res[i].item, res[i].department, res[i].price.toFixed(2), res[i].quantity)
			);
		}
		console.log();
		console.table(tableArr);
		ItemAdder(res);
	});
};

ItemAdder;
var ItemAdder = function(res) {
	var db_resp = res;
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'choice',
				message: 'Enter the ID of the product you want to add more items of.'
			}
		])
		.then(function(answer) {
			// console.log('this is the response:', db_resp);

			for (var i = 0; i < db_resp.length; i++) {
				if (db_resp[i].item_id == answer.choice) {
					correct = true;
					var id = i;
					var product = db_resp[i].productname;
					inquirer
						.prompt({
							type: 'input',
							name: 'quantity',
							message: 'How many do you want to add?',
							validate: function(value) {
								if (isNaN(value) == false) {
									return true;
								} else {
									return false;
								}
							}
						})
						.then(function(answer) {
							var stock = parseInt(db_resp[id].quantity);
							var items = parseInt(answer.quantity);
							var newQuantity = stock + items;
							console.log('this the it');
							console.log(db_resp[id].item_id);
							if (newQuantity >= 0) {
								connection.query(
									"UPDATE products SET quantity='" +
										newQuantity +
										"' WHERE item_id='" +
										db_resp[id].item_id +
										"'",
									function(err, res2) {
										console.log('Items added');
										viewItems();
									}
								);
								// updateStock(answer.item_id, resultQuantity);
								console.log('You added ' + answer.quantity);
							}
						});
				}
			}
		});
};

// Add a new product
var AddNewItem = function() {
	connection.query('SELECT * FROM department', function(err, results) {
		if (err) throw err;
		inquirer
			.prompt([
				{
					name: 'product',
					type: 'input',
					message: 'What item would you like to add?'
				},
				{
					name: 'department',
					type: 'rawlist',
					choices: function() {
						var choiceArray = [];
						for (var i = 0; i < results.length; i++) {
							choiceArray.push(results[i].department);
						}
						return choiceArray;
					},
					message: 'Enter the department.'
				},
				{
					name: 'price',
					type: 'input',
					message: 'enter price'
				},
				{
					name: 'quantity',
					type: 'input',
					message: 'How quantity'
				}
			])
			.then(function(answer) {
				connection.query(
					'INSERT INTO products SET ?',
					{
						product: answer.product,
						department: answer.department,
						price: answer.price,
						stockquantity: answer.quantity,
						product_sales: 0
					},
					function(err) {
						if (err) throw err;
						console.log('Your product was added successfully!');
						mgmtOperationsList();
					}
				);
			});
	});
};

mgmtOperationsList();
