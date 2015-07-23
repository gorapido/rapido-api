// Global packages
var Sequelize = require('sequelize'),
  bcrypt = require('bcrypt-nodejs');

// Configuration by NODE_ENV (test, development, production)
var env = process.env.NODE_ENV || "development";
var config = require('./../config')[env];
var database = config.database;

// DB connection
var connection = new Sequelize(database.name, database.username, database.password, database.options);

// Check if connection was successful
connection.authenticate().catch(function(error) {
  throw new Error("Database connection failed! Please check your configuration.");
});

// User Model
var User = connection.define('user', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
    unique: true
  },
  first_name: {
    type: Sequelize.STRING,
    validate: {
      isAlpha: true,
      isUppercase: true,
      notNull: true,
      notEmpty: true
    },
    set: function(val) {
      this.setDataValue('first_name', val.toUpperCase());
    }
  },
  last_name: {
    type: Sequelize.STRING,
    validate: {
      isAlpha: true,
      isUppercase: true,
      notNull: true,
      notEmpty: true
    },
    set: function(val) {
      this.setDataValue('last_name', val.toUpperCase());
    }
  },
  phone: {
    type: Sequelize.STRING,
    validate: {
      notNull: true,
      notEmpty: true
    }
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
      notNull: true,
      notEmpty: true
    }
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      isAlphanumeric: true,
      min: 6,
      notNull: true,
      notEmpty: true
    },
    set: function(val) {
      this.setDataValue('password', bcrypt.hashSync(val));
    }
  },
  // The following is address data; this should be moved to a separate table later on.
  street: {
    type: Sequelize.STRING,
    validate: {
      notNull: true,
      notEmpty: true
    }
  },
  city: {
    type: Sequelize.STRING,
    validate: {
      notNull: true,
      notEmpty: true
    }
  },
  state: {
    type: Sequelize.STRING,
    validate: {
      notNull: true,
      notEmpty: true
    }
  },
  postal_code: {
    type: Sequelize.STRING,
    validate: {
      notNull: true,
      notEmpty: true
    }
  }
}, {
  timestamps: true,
  paranoid: true
});

// Job Model
var Job = connection.define('job', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
    unique: true
  },
  start: {
    type: Sequelize.DATE
  },
  category: {
    type: Sequelize.STRING
  },
  summary: {
    type: Sequelize.TEXT
  }
}, {
  timestamps: true,
  paranoid: true
});

// Job relationships
User.hasMany(Job, { as: 'jobs' });

connection.sync();

module.exports = {
  connection: connection,
  User: User,
  Job: Job
};
