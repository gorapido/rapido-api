var Sequelize = require('sequelize');
var bcrypt = require('bcrypt-nodejs');
var sequelize = new Sequelize('rapido-database', 'postgres', '', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
   max: 5,
   min: 0,
   idle: 10000
  }
});
var User = sequelize.define('user', {
  id: {
    type: Sequelize.UUID,
    field: 'id',
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
    unique: true
  },
  firstName: {
    type: Sequelize.STRING,
    field: 'firstName'
  },
  lastName: {
    type: Sequelize.STRING,
    field: 'lastName'
  },
  email: {
    type: Sequelize.STRING,
    field: 'email'
  },
  password: {
    type: Sequelize.STRING,
    field: 'password'
  },
  phone: {
    type: Sequelize.STRING,
    field: 'phone'
  },
  street: {
    type: Sequelize.STRING,
    field: 'street'
  },
  city: {
    type: Sequelize.STRING,
    field: 'city'
  },
  state: {
    type: Sequelize.STRING,
    field: 'state'
  },
  postalCode: {
    type: Sequelize.STRING,
    field: 'postalCode'
  }
}, {
  freezeTableName: true
});
var Job = sequelize.define('job', {
  id: {
    type: Sequelize.UUID,
    field: 'id',
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
    unique: true
  },
  startDate: {
    type: Sequelize.DATE,
    field: 'startDate'
  },
  problem: {
    type: Sequelize.TEXT,
    field: 'problem'
  }
});
User.hasMany(Job, {as: 'jobs'});
function hashPassword(password){
  return bcrypt.hashSync(password);
}
function isPassword(password){
  return bcrypt.compareSync(password,
}
function createUser(firstName,lastName, email, password, phone, street, city, state, postalCode){
  password = hashPassword(password);
  User.sync().then(function(){
    return User.create({
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
  });
}