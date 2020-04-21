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

const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const s3 = new aws.S3({ /* ... */ })
const dynamoDB = new aws.DynamoDB({});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'adio-1131216-adio',
    metadata: function (req, file, cb) {
      cb(null, { 
        email: req.session.email, 
        campaignName: req.body.campaignName,
        minLat: req.body.minLat,
        minLng: req.body.minLng,
        maxLat: req.body.maxLat,
        maxLng: req.body.maxLng,
        description: req.body.description,
        fieldName: file.fieldname,
      });
    },
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

app.post('/deleteFiles', routes.delete_audio);

http.listen(8080);
console.log('Server running on port 8080.');