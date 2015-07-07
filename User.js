function UserObject(firstName, lastName, email, password, phone, street, city, state, postalCode){
	this.firstName = firstName;
	this.lastName = lastName;
	this.email = email;
	this.password = password;
	this.phone = phone;
	this.street = street;
	this.city = city;
	this.state = state;
	this.postalCode = postalCode;
};
UserObject.prototype =
{
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
module.exports = {
	createUser: function(firstName, lastName, email, password, phone, street, city, state, postalCode){ return new UserObject(firstName, lastName, email, password, phone, street, city, state, postalCode); }
};