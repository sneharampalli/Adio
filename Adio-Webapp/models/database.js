var async = require('async');
var dynamo = require('dynamodb');
dynamo.AWS.config.loadFromPath('config.json');
Joi = require('joi');
var crypto = require('crypto');

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

// Function to verify the login credentials of a company with the database
var dbCheckLogin = function (email, password, route_callback) {
  Company.get(email, function (err, acc) {
    if (err) {
      route_callback(false, err);
    } else if (acc === null) {
      route_callback(false, null, "Company does not exist");
    } else {
      hash = crypto.pbkdf2Sync(password, acc.get('salt'), 1000, 64, `sha512`).toString(`hex`);
      if (acc.get('hash') === hash) {
        route_callback(true, acc.get('firstname'), null);
      } else {
        route_callback(false, null, "Incorrect password");
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
      var salt = crypto.randomBytes(16).toString('hex');
      var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
      Company.create({
        email: email,
        firstname: firstname,
        lastname: lastname,
        companyname: companyname,
        salt: salt,
        hash: hash,
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
