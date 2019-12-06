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
		password: Joi.string(),
	}
});

dynamo.createTables(function (err) {
	if (err) {
		console.log('Error creating tables: ', err);
	} else {
		console.log('Tables has been created');
	}
});
