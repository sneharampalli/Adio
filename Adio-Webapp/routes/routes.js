var db = require('../models/database.js');
var dynamo = require('dynamodb');
dynamo.AWS.config.loadFromPath('config.json');

const aws = require('aws-sdk')
const docClient = new aws.DynamoDB.DocumentClient();

const s3 = new aws.S3();
const S3_BUCKET = 'adio-1131216-adio';

// Get route for main / home / login page
var getMain = function (req, res) {
  if (req.session.loginsuccess) {
    res.redirect('/account');
  } else {
    res.render('login.ejs');
  }
};

var deleteAudio = function (req, res) {
  console.log(req.body);
  var params = {  
    Bucket: S3_BUCKET, 
    Key: req.body.file 
  };

  s3.deleteObject(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);  
    }
    else {
      console.log('File has been deleted');
    }
  });
  var params = {
    TableName: 'Ad-hlqdhevr3jbxlifobmcnha2vxu-adio',
    Key:{
        "uniqueID": req.body.file,
    },
  };
  console.log("Attempting a conditional delete...");
  docClient.delete(params, function(err, data) {
      if (err) {
          console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
      }
  });
  res.send({redirectUrl: "/account"});
}

var getAccount = function (req, res) {
  console.log(req.session.loginsuccess);
  if (req.session.loginsuccess) {

    var params = {
        TableName: 'Ad-hlqdhevr3jbxlifobmcnha2vxu-adio',
        IndexName: 'ByUsername',
        KeyConditionExpression: 'email = :person',
        ExpressionAttributeValues: {
            ':person': req.session.email
        },
    };
  
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
              console.log(" -", item);
            });
            const campaigns = {};
            if (data.Items.length > 0) {
              for (i = 0; i < data.Items.length; i++) {
                const campaignName = data.Items[i].campaignName;
                const adName = data.Items[i].adName.split('.')[0];
                const currData = {
                  campaignName : campaignName,
                  adName : adName,
                  description : data.Items[i].description,
                  numImpressions : data.Items[i].numImpressions,
                  minLat : data.Items[i].minLat,
                  minLng : data.Items[i].minLng,
                  maxLat : data.Items[i].maxLat,
                  maxLng : data.Items[i].maxLng,
                  currKey: data.Items[i].file.key
                };
                if (campaignName in campaigns) {
                  campaigns[campaignName].push(currData);
                } else {                
                  campaigns[campaignName] = [currData];
                }
              }
            } 
            res.render('account.ejs', {firstname: req.session.firstname, campaigns: campaigns});
        }
    });
  } else {
    res.render('login.ejs');
  }
}

// Post route for verifying login
var postCheckLogin = function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  db.dbCheckLogin(email, password, function (success, name, err) {
    if (success) {
      req.session.loginsuccess = true;
      req.session.email = email;
      req.session.firstname = name;
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
      req.session.firstname = firstName;
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
  get_account: getAccount,
  delete_audio: deleteAudio
};

module.exports = routes;
