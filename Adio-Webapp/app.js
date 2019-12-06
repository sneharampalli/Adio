const express = require('express');
const routes = require('./routes/routes.js');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const db = require('./models/database.js');
app.use(express.bodyParser());
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

http.listen(8080);
console.log('Server running on port 8080.');
