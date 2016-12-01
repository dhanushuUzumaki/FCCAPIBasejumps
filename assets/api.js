var moment = require('moment');
var bodyParser = require("body-parser");
var validUrl = require('valid-url');
var MongoClient = require("mongodb").MongoClient;
var autoIncrement = require("mongodb-autoincrement");
require('dotenv').config();
var mongo_url = process.env.MONGO_URI;
autoIncrement.setDefaults({
    collection: "url_counters",     // collection name for counters, default: counters 
    field: "_id",               // auto increment field name, default: _id 
    step: 2             // auto increment step 
});

function API() {


	//timestamp microservice api
	this.timestamp = function(req, res) {

	var date = req.params.dateString;
	var responseOnject = {unix : null, natural : null};

	//check if it is a unix time stamp
	if(+date >= 0) {
		console.log("received a unix time stamp");
		responseOnject.unix = +date;
		responseOnject.natural = moment.unix(date).format("MMMM DD, YYYY");
	}

	//check if it is one of supported natural date format
	else {

		var valid = moment(date, 'MMMM DD, YYYY').isValid();

		if(valid) {
			responseOnject.natural = date;
			responseOnject.unix = moment(date, 'MMMM DD, YYYY').unix();
		}
	}

	//send the result json object
	res.json(responseOnject);

	};

	//request header parser api
	this.parseheader = function(req, res) {
	var responseObject = {};
	//ip address in req.ip
	//language in accept-language
	//os in user agent in first ()
	
	responseObject.ip_address = req.ip.substring(req.ip.lastIndexOf(':')+1, req.ip.length);
	responseObject.language = req.headers['accept-language'].substring(0,req.headers['accept-language'].indexOf(','));
	var ua = req.headers['user-agent'];
	responseObject.operating_system = ua.substring(ua.indexOf('('),ua.indexOf(')'));
	res.json(responseObject);
	};

	//url shortner
	this.shortenUrl = function(req, res) {
		var url = req.body.url;
		if(validUrl.isUri(url)){
			MongoClient.connect(mongo_url, function (err, db) {
				if(err)
					throw err;

				db.collection("urlShort").findOne({url : url}, function(error, obj) {
					if(err)
						throw err;
					else
						if(obj) {
							res.status(200);
							res.json({success : "Valid URL", shortenedURL: "https://fcc-api-basejumps.herokuapp.com/api/urlshortner/"+obj.shortenedURL});
							db.close();
						}
						else {
						    autoIncrement.getNextSequence(db, "url_counters", function (err, autoIndex) {
						        var collection = db.collection("urlShort");
						        console.log(autoIndex);
						        collection.insert({
						            shortenedURL: autoIndex,
						            url: url
						        },function(error, result) {
						        	if(error)
						        		throw error;
						        	else{
						        		console.log("inserted..");
						        		res.status(200);
										res.json({success : "Valid URL", shortenedURL: "https://fcc-api-basejumps.herokuapp.com/api/urlshortner/"+autoIndex});
										db.close();
						        	}
						        });
						    });
						}
				});


			});
		}
		else {
			res.status(400);
			res.json({error : 'Not a valid URL'});
		}
	};

	//un shorten url
	this.unshortenurl = function(req, res) {
		var shortened = req.params.shortened;
		MongoClient.connect(mongo_url, function(err, db) {
			if(err)
				throw err;
			db.collection("urlShort").findOne({shortenedURL : parseInt(shortened)}, function(error, obj) {
				if(error)
					throw error;
				if(obj) {
					res.status(301);
					res.redirect(obj.url);
				}
				else {
					res.status(404);
					res.sendFile( process.cwd() + '/public/404.html' );
				}
				db.close();
			});
		});
	};


}

module.exports = API;