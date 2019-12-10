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
app.use(express.logger("default"));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.get_main);
app.post('/checklogin', routes.post_checklogin);
app.post('/createaccount', routes.post_createaccount);
app.get('/logout', routes.get_logout);

const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const s3 = new aws.S3({ /* ... */ })

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'adio-1',
    metadata: function (req, file, cb) {
      cb(null, { email: req.session.email, fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      var path = req.session.email + '/' + file.originalname;
      cb(null, path);
    }
  })
})

app.post('/audio', upload.single('music'), function (req, res, next) {
  if (req.file) {
    console.log("Successfully received!")
  } else {
    console.log("Error!");
  }  
})

// app.get('/renderAudio', routes.get_audio);

http.listen(8080);
console.log('Server running on port 8080.');
