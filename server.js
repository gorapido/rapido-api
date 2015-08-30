var express = require('express'),
	bodyParser = require('body-parser'),
	logger = require('morgan'),
	passport = require('passport');
var app = express();
var connection = require('./models').connection;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');

var routes = require('./routes')(express.Router());

app.use('/v1', routes);

connection.sync().then(function() {
	var server = app.listen(app.get('port'), function() {
	  console.log('Express server listening on port ' + server.address().port);
	});
});
