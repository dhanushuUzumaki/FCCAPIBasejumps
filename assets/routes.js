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

	app.get('*',function(req,res) {
		res.sendFile( process.cwd() + '/public/404.html' );
	});
};