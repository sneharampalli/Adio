const express = require('express');
const routes = require('./routes/routes.js');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const db = require('./models/database.js');
var bodyParser = require('body-parser');
var AthenaExpress = require('athena-express');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.cookieParser());
app.use(express.session({
  secret: 'thisIsMySecret'
}));
app.use(express.logger('default'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/account', routes.get_account);
app.get('/', routes.get_main);
app.post('/checklogin', routes.post_checklogin);
app.post('/createaccount', routes.post_createaccount);
app.get('/logout', routes.get_logout);
app.get('/submitads', routes.get_submitads);

const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const s3 = new aws.S3({ /* ... */ })
const dynamoDB = new aws.DynamoDB({});
const docClient = new aws.DynamoDB.DocumentClient();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'adio-1131216-adio',
    acl: 'public-read',
    key: function (req, file, cb) {
      var path = req.session.email + '_' + req.body.campaignName + '_' + Date.now() + '_' + file.originalname;
      cb(null, path);
    }
  })
})

app.use(upload.array());
app.post('/audio', upload.array('ad', 5), function (req, res, next) {
  if (req.files) {
    console.log('Successfully uploaded ad to s3!');
    for (i = 0; i < req.files.length; i++) {
      var params = {
        Item: {
          'uniqueID': {
            S: req.files[i].key
          }, 
          'campaignName': {
            S: req.body.campaignName
          }, 
          'adName': {
            S: req.files[i].originalname
          },
          'email': {
            S: req.session.email
          },
          'maxLat': {
            N: req.body.maxLat
          },
          'maxLng': {
            N: req.body.maxLng
          },
          'minLat': {
            N: req.body.minLat
          },
          'minLng': {
            N: req.body.minLng
          },
          'maxLng#minLat#minLng': {
            S: req.body.maxLng + '#' + req.body.minLat + '#' + req.body.minLng
          },
          'description': {
            S: req.body.description
          },
          'numImpressions': {
            N: '0'
          },
          'file': {'M': {'bucket': {'S': req.files[i].bucket}, 'key': {'S': req.files[i].key}, 'region': {'S': 'us-east-1'}}}
        }, 
        ReturnConsumedCapacity: 'TOTAL', 
        TableName: 'Ad-hlqdhevr3jbxlifobmcnha2vxu-adio'
      };
      dynamoDB.putItem(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); 
        } else {
          console.log('Successfully put into Ads dynamodb!')
          console.log(data);
        } 
      });
    }
  } else {
    console.log('Error!');
  }  
});

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'adio-1131216-adio',
//     acl: 'public-read',
//     key: function (req, file, cb) {
//       var path = req.session.email + '_' + Date.now() + '_' + file.originalname;
//       cb(null, path);
//     }
//   })
// })

// app.use(upload.array());
// app.post('/audio', upload.array('ad', 5), function (req, res, next) {
//   if (req.files) {
//     console.log('Successfully uploaded ad to s3!');
    
//     for (i = 0; i < req.files.length; i++) {
//       var params = {
//         Item: {
//           'uniqueID': req.files[i].key,
//           'campaignName': req.body.campaignName,
//           'adName': req.files[i].originalname,
//           'email': req.session.email,
//           'maxLat': Number.parseFloat(req.body.maxLat),
//           'maxLng': Number.parseFloat(req.body.maxLng),
//           'minLat': Number.parseFloat(req.body.minLat),
//           'minLng': Number.parseFloat(req.body.minLng),
//           'description': req.body.description,
//           'numImpressions': '0',
//           'file': {'bucket': req.files[i].bucket, 'key': req.files[i].key, 'region': 'us-east-1' }
//         }, 
//         TableName: 'Ad-hlqdhevr3jbxlifobmcnha2vxu-adio'
//       };
//       docClient.put(params, function(err, data) {
//         if (err) {
//           console.log(err, err.stack); 
//         } else {
//           console.log('Successfully put into Ads dynamodb!')
//           console.log(data);
//         } 
//       });
//     }
//     res.send({redirectUrl: '/account'});
//   } else {
//     console.log('Error!');
//   }  
// });

app.post('/deleteFiles', routes.delete_audio);
app.post('/editCampaign', upload.array('ad', 5), function (req, res) {
  console.log(req.files);
  if (req.files) {
    console.log('Successfully uploaded ad to s3!');
    console.log(req.body);
    const campaignName = req.body['campaign-name'];
    const maxLat = req.body['maxLat-'.concat(campaignName.replace(/\s+/g, ''))];
    const maxLng = req.body['maxLng-'.concat(campaignName.replace(/\s+/g, ''))];
    const minLat = req.body['minLat-'.concat(campaignName.replace(/\s+/g, ''))];
    const minLng = req.body['minLng-'.concat(campaignName.replace(/\s+/g, ''))];

    for (i = 0; i < req.files.length; i++) {
      var params = {
        Item: {
          'uniqueID': req.files[i].key,
          'campaignName': campaignName,
          'adName': req.files[i].originalname,
          'email': req.session.email,
          'maxLat': Number.parseFloat(maxLat),
          'maxLng': Number.parseFloat(maxLng),
          'minLat': Number.parseFloat(minLat),
          'minLng': Number.parseFloat(minLng),
          'description': req.body.description,
          'numImpressions': '0',
          'file': {'bucket': req.files[i].bucket, 'key': req.files[i].key, 'region': 'us-east-1'} 
        },
        TableName: 'Ad-hlqdhevr3jbxlifobmcnha2vxu-adio',
        ReturnConsumedCapacity: 'TOTAL'
      };
      docClient.put(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); 
        } else {
          console.log('Successfully put into Ads dynamodb!')
          console.log(data);
        } 
      });
    }
    // Update existing data
    const campaignData = req.body.campaignData.split(',');    
    for (i = 0; i < campaignData.length; i++) {
      var updateParams = {
        TableName: 'Ad-hlqdhevr3jbxlifobmcnha2vxu-adio',
        Key: {
          "uniqueID": campaignData[i],
        },
        UpdateExpression: "set campaignName =:campaignName, maxLat =:maxLat, maxLng =:maxLng, minLat =:minLat, minLng =:minLng, description =:description",
        ExpressionAttributeValues:{
            ":campaignName": campaignName,
            ":maxLat" : Number.parseFloat(maxLat),
            ":maxLng": Number.parseFloat(maxLng),
            ":minLat": Number.parseFloat(minLat),
            ":minLng": Number.parseFloat(minLng),
            ":description": req.body.description
        },
        ReturnValues: "UPDATED_OLD"
      }
      docClient.update(updateParams, function(err, data) {
        if (err) {
          console.log(err, err.stack); 
        } else {
          console.log('Successfully updated dynamodb!')
          console.log(data);
        } 
      });
    }
    res.send({redirectUrl: "/account"});
  } else {
    console.log(req.body);
  }
  
});

// http.listen(process.env.PORT);
http.listen(8080);
console.log('Server running on port 8080.');