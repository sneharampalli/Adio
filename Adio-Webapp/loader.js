var dynamo = require('dynamodb');
dynamo.AWS.config.loadFromPath('config.json');
Joi = require('joi');

var Company = dynamo.define('Company', {
	hashKey: 'email',
	schema: {
		email: Joi.string().email(),
		companyname: Joi.string(),
		firstname: Joi.string(),
		lastname: Joi.string(),
		salt: Joi.string(),
		hash: Joi.string(),
	}
});

// Company.deleteTable(function (err) {
// 	if (err) {
// 		console.log('Error deleting table: ', err);
// 	} else {
// 		console.log('Table has been deleted');
// 	}
// });

dynamo.createTables(function (err) {
	if (err) {
		console.log('Error creating tables: ', err);
	} else {
		console.log('Tables has been created');
	}
});
