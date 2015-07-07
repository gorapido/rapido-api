var database = require('./database.js');
var User = require('./User.js');
//var user = User.createUser('Michael', 'Kimball', 'mdk20@students.uwf.edu', 'password', '7274391051', '2997 Moore Dr.', 'Oviedo', 'FL', '32765');
//database.createUser(user.getFirstName(), user.getLastName(), user.getEmail(), user.getPassword(), user.getPhone(), user.getStreet(), user.getCity(), user.getState(), user.getPostalCode());
//console.log(user.firstName+ ", " + user.lastName+ ", " + user.email+ ", " + user.password+ ", " + user.phone+ ", " + user.street+ ", " + user.city+ ", " + user.state+ ", " + user.postalCode);
var valid = function(bool){
	if(bool){
		console.log('this is true');
	}
};
//var userObj = database.findUserByEmail('mdk20@students.uwf.edu', function(user){
//	console.log(user.getFirstName());
//});
//console.log(database.isPassword('password', 'mdk20@students.uwf.edu', valid));
//database.createJob('mdk20@students.uwf.edu', '2015-07-04 12:52:00-05', 'My room is a mess');