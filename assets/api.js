var moment = require('moment');

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


}

module.exports = API;