var bcrypt = require('bcrypt-nodejs')
var schema = require('./db/schema');
var UserTable = schema.UserTable;

var User = function(attributes){
	this._table = new UserTable();

	// Relational members
	this._jobs = [];

	// General members
	this._firstName = attributes.firstName;
	this._lastName = attributes.lastName;
	this._email = attributes.email;
	this._password = attributes.password;
	this._phone = attributes.phone;
	this._street = attributes.street;
	this._city = attributes.city;
	this._state = attributes.state;
	this._postalCode = attributes.postalCode;
};

User.prototype = {
	getFirstName: function(){ return this.firstName; },
	getLastName: function(){ return this.lastName; },
	getEmail: function(){ return this.email },
	getPassword: function(){ return this.password },
	getPhone: function(){ return this.phone },
	getStreet: function(){ return this.street },
	getCity: function(){ return this.city },
	getState: function(){ return this.state },
	getPostalCode: function(){ return this.postalCode },
	setId: function(id){ this.id = id; },
	getId: function(){ return this.id }
};

// Instance methods
User.prototype.save = function() {

};

User.prototype.update = function(attributes) {

}

User.prototype.delete = function() {

};

User.prototype.addJob = function(job, email){
	User.findByEmail.then(function(user){
		user.addJobs(job);
	});
};

// Static methods
User.findById = function(id) {
	return this._table.findOne({
		where: {
			id: id
		}
	});
};

User.findByEmail = function(email) {
	return this._table.findOne({
		where:{
			email: email
		}
	});
};

User.deleteById = function(id) {

};

User.logIn = function(username, password) {
	User.findByEmail(username).then(function(user) {
		bcrypt.comparePassword(password, this._password, function(err, res) {
			if (res) {
				return user;
			}
		});
	});
};

User.hashPassword = function(password) {
	return bcrypt.hashSync(password);
};

var Job = function(attributes) {
	this._table = JobTable;

	this._coordinates = attributes.coordinates;
	this._start = attributes.start;
	this._end = attributes.end;
	this._summary = attributes.description;
	this._category = attributes.category;
};

module.exports = {
	User: User,
	Job: Job
};
