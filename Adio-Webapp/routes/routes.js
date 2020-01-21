var db = require('../models/database.js');
var dynamo = require('dynamodb');
dynamo.AWS.config.loadFromPath('config.json');

const aws = require('aws-sdk')
const s3 = new aws.S3({ /* ... */ })

// var postS3Objects = function (req, res) {
//   var params = {
//     Bucket: "adio-1",
//     Prefix: req.session.email + '/',
//   };
//   var objs = [];
//   s3.listObjectsV2(params, function (err, data) {
//     if (err) {
//       console.log(err, err.stack); // an error occurred
//     }
//     else {
//       for (let i = 0; i < data.Contents.length; i++) {
//         var getParams = {
//           Bucket: "adio-1",
//           Key: data.Contents[i].Key
//         };
//         s3.getObject(getParams, function (err2, data2) {
//           if (err2) {
//             console.log(err2, err2.stack); // an error occurred
//           } else {
//             res.send({ data: data2 });
//           }
//         });
//       }
//     }
//   });
// }

// Get route for main / home / login page
var getMain = function (req, res) {
  if (req.session.loginsuccess) {
    var params = {
      Bucket: 'adio-1', /* required */
      Prefix: req.session.email,
    };
    s3.listObjects(params, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        res.render('dashboard.ejs', {data: data});
        console.log(data);
      }
    });
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
  get_logout: getLogout,
  // get_audio: postS3Objects
};

module.exports = routes;
