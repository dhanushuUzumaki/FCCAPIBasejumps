var API = require( process.cwd() + '/assets/api.js');
module.exports = function(app) {
	var api = new API();

	app.get('/',function(req,res) {
		res.sendFile( process.cwd() + '/public/index.html' );
	});

	app.get('/api/timestamp',function(req,res) {
		res.sendFile( process.cwd() + '/public/timestamp.html' );
	});

	app.get('/api/timestamp/:dateString', api.timestamp);

	app.get('/api/reqheadparse', api.parseheader);

	app.get('/api/urlshortner',function(req, res) {
		res.sendFile( process.cwd() + '/public/urlshortner.html' );
	});

	app.post('/api/shortenurl',api.shortenUrl);

	app.get('/api/urlshortner/:shortened', api.unshortenurl);

	app.get('/api/searchimage',function(req, res) {
		res.sendFile( process.cwd() + '/public/searchimage.html' );
	});

	app.get('/api/searchimage/:querystring',api.searchImage);

	app.get('/api/searchhistory',api.searchHistory);

	app.get('*',function(req,res) {
		res.sendFile( process.cwd() + '/public/404.html' );
	});
};