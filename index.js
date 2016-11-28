var express = require('express');
var routes = require('./assets/routes.js');
require('dotenv').config();
var app = express();
app.use('/public',express.static( __dirname + '/public'));

routes(app);

var port = process.env.PORT;
app.listen(port, function() {
	console.log("App running at 8080");
});
