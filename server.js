var express = require('express'),
	bodyParser = require('body-parser'),
	logger = require('morgan');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: errorMessage,
        error: (app.get('env') === 'development') ? err : {}
    });
});

app.set('port', process.env.PORT || 3000);

var routes = require('./app/routes')(express.Router());

// Routes go here.

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
