var Sequelize = require('sequelize');
var bcrypt = require('bcrypt-nodejs');
var sequelize = new Sequelize('rapido-database', 'postgres', 'blastoiseisawesome', {
  host: 'localhost',
  port: 5000,
  dialect: 'postgres',
  pool: {
   max: 5,
   min: 0,
   idle: 10000
  }
});
var User = require('./User.js');
var UserTable = sequelize.define('user', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
    unique: true
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.STRING
  },
  street: {
    type: Sequelize.STRING
  },
  city: {
    type: Sequelize.STRING
  },
  state: {
    type: Sequelize.STRING
  },
  postalCode: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true
});
var JobTable = sequelize.define('job', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
    unique: true
  },
  startDate: {
    type: Sequelize.DATE
  },
  problem: {
    type: Sequelize.TEXT
  }
});
UserTable.hasMany(JobTable, {as: 'Jobs'});

/*
 * Password hashing/comparison
 */
function hashPassword(password){
  return bcrypt.hashSync(password);
}
var isPassword = function (password, email, test){
  findUserByEmail(email).then(function(data){
	bcrypt.compare(password, data.get('password'), function(err, res){
		test(res);
	});
  });
};

/*
 * User search
 */
var findUserByEmail = function(email, callback){
	var user;
	searchDatabaseByEmail(email).then(function(data){
		user = User.createUser(data.get('firstName'), data.get('lastName'),
			data.get('email'), data.get('password'), data.get('phone'),
			data.get('street'), data.get('city'), data.get('state'),
			data.get('postalCode'));
		user.setId(data.get('id');
		callback(user);
	});
};
var searchDatabaseByEmail = function(email){
	return UserTable.findOne({
		where:{
			email: email
		}
	});
}
/*
 * Row creation
 */
var createUser = function (firstName, lastName, email, password, phone, street, city, state, postalCode){
  password = hashPassword(password);
  UserTable.sync().then(function(){
	findUserByEmail(email, function(data){
		if(data.getEmail() == email){
			console.log('Error! User already exists.');
		}else{
			console.log(firstName+ ", " + lastName+ ", " + email+ ", " + password+ ", " + phone+ ", " + street+ ", " + city+ ", " + state+ ", " + postalCode);
			return UserTable.create({
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password,
				phone: phone,
				street: street,
				city: city,
				state: state,
				postalCode: postalCode
			});
		}
	});
  });
};

var createJob = function(email, startDate, problem){
	JobTable.sync().then(function(){
		JobTable.create({
			startDate: startDate,
			problem: problem
		}).then(function(data){
			addJob(data, email);
		});
	});
};

function addJob(job, email){
	searchDatabaseByEmail(email).then(function(data){
		data.addJobs(job);
	});
};

module.exports = {
	createUser: createUser,
	createJob: createJob,
	findUserByEmail: findUserByEmail,
	isPassword: isPassword
};