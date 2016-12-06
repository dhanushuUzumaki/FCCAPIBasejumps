var express = require('express');
var bodyParser = require("body-parser");
var routes = require('./assets/routes.js');
require('dotenv').config();
var app = express();
app.use('/public',express.static( __dirname + '/public'));
app.use('/bower_components',express.static( __dirname + '/bower_components'));
app.use(bodyParser.urlencoded({extended: false}));
routes(app);

var port = process.env.PORT;
app.listen(port, function() {
	console.log("App running at 8080");
});
