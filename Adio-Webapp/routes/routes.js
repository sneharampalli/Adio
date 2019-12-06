var db = require('../models/database.js');
var dynamo = require('dynamodb');
dynamo.AWS.config.loadFromPath('config.json');

// Get route for main / home / login page
var getMain = function (req, res) {
  if (req.session.loginsuccess) {
    res.render('dashboard.ejs');
  } else {
    res.render('login.ejs');
  }
};

// Post route for verifying login
var postCheckLogin = function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  db.dbCheckLogin(email, password, function (success, err) {
    if (success) {
      req.session.loginsuccess = true;
      req.session.email = email;
    }
    res.send({
      err: success ? null : err,
    });
  });
};

// Post route for creating a new login
var postCreateAccount = function (req, res) {
  var email = req.body.newEmail;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var companyname = req.body.newCompanyname;
  var password = req.body.newPassword;
  db.dbCreateAccount(email, firstName, lastName, companyname, password, function (success, err) {
    if (success) {
      req.session.loginsuccess = true;
      req.session.email = email;
    }
    res.send({
      err: success ? null : err,
    });
  });
};

// Get route to logout
var getLogout = function (req, res) {
  req.session.loginsuccess = false;
  req.session.email = null;
  req.session.companyname = null;
  res.redirect('/');
};

var routes = {
  get_main: getMain,
  post_checklogin: postCheckLogin,
  post_createaccount: postCreateAccount,
  get_logout: getLogout
};

module.exports = routes;
