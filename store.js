var inquirer = require('inquirer');
var mysql = require('mysql');
var colors = require('colors');
require('dotenv').config();

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'bamazon_db',
	password: process.env.DB_ADMIN_PASSWORD
});

connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('connected as id ' + connection.threadId);
});

colors.setTheme({
	item: 'brightCyan',
	pick: 'brightMagenta',
	verbiage: 'green',
	instructions: 'cyan',
	warn: 'yellow',
	guessesLeft: 'blue',
	lose: 'red',
	youWin: 'blue',
	winWord: 'brightGreen'
});

// display inventory
connection.query('SELECT * FROM products', function(error, results, fields) {
	if (error) throw error;
	//if no error
	console.log('Products');
	console.log('--------');
	var products = [];
	for (var i = 0; i < results.length; i++) {
		products.push(results[i]);
		displayItem(results[i]);
	}

	// user interface
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'item_id',
				message: 'Enter a product ID:'
			},
			{
				type: 'input',
				name: 'quantity',
				message: 'Enter a quantity:'
			}
		])
		.then(function(ans) {
			var theItem = results[ans.item_id - 1];
			if (!theItem) {
				console.log('item not found');
				connection.end();
			} else {
				var resultQuantity = theItem.quantity - ans.quantity;
				var resultPrice = ans.quantity * theItem.price;
				if (resultQuantity >= 0) {
					updateStock(ans.item_id, resultQuantity);
					console.log(
						'You bought ' +
							ans.quantity +
							' ' +
							theItem.item +
							' your total is ' +
							'$' +
							resultPrice.toFixed(2)
					);
				} else {
					console.log('Insufficient Quantity');
					connection.end();
				}
			}
		});
});

function displayItem(item) {
	console.log('Product:', item.item);
	console.log('ID:', item.item_id);
	console.log('Price:', item.price);
	console.log('--------------');
}

function updateStock(id, newQuantity) {
	connection.query('UPDATE products SET quantity = ' + newQuantity + ' WHERE item_id = ' + id + ';', function(
		error,
		results,
		fields
	) {
		if (error) throw error;
	});
	connection.end();
}

// msallam@bootcampspot.com
