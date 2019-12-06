var async = require('async');
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

// Function to verify the login credentials of a company with the database
var dbCheckLogin = function (email, password, route_callback) {
  Company.get(email, function (err, acc) {
    if (err) {
      route_callback(false, err);
    } else if (acc === null) {
      route_callback(false, "Company does not exist");
    } else {
      if (acc.get('password') === password) {
        route_callback(true, null);
      } else {
        route_callback(false, "Incorrect password");
      }
    }
  });
};

// Function to create a new login for a company in the database
var dbCreateAccount = function (email, firstname, lastname, companyname, password, route_callback) {
  Company.get(email, function (err, acc) {
    if (err) {
      route_callback(false, err);
    } else if (acc === null) {
      Company.create({
        email: email,
        firstname: firstname,
        lastname: lastname,
        companyname: companyname,
        password: password
      }, function (err, acc) {
        if (err) {
          route_callback(false, err);
        } else {
          route_callback(true, null);
        }
      });
    } else {
      route_callback(false, "Company already exists");
    }
  });
};

var database = {
  dbCheckLogin: dbCheckLogin,
  dbCreateAccount: dbCreateAccount,
};

module.exports = database;
