var express = require('express'),
	bodyParser = require('body-parser'),
	logger = require('morgan');
var app = express();
var connection = require('./app/models').connection;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('port', process.env.PORT || 3000);

var routes = require('./app/routes')(express.Router());

app.use('/v1', routes);

connection.sync().then(function() {
	var server = app.listen(app.get('port'), function() {
	  console.log('Express server listening on port ' + server.address().port);
	});
});
