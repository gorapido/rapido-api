// Global packages
var Sequelize = require('sequelize'),
  bcrypt = require('bcrypt-nodejs');

// Configuration by NODE_ENV (test, development, production)
var env = process.env.NODE_ENV || "development";
var config = require('./../config')[env];
var database = config.database;

// DB connection
var connection = new Sequelize(database.name, database.username, database.password, database.options);

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
      notEmpty: true
    }
  },
  last_name: {
    type: Sequelize.STRING,
    validate: {
      isAlpha: true,
      notEmpty: true
    }
  },
  phone: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      min: 6,
      notEmpty: true
    },
    set: function(val) {
      this.setDataValue('password', bcrypt.hashSync(val));
    }
  }
}, {
  timestamps: true
});

// Address Model
var Address = connection.define('address', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
    unique: true
  },
  street: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  },
  city: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  },
  state: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  },
  postal_code: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  }
}, {
  timestamps: true
});

// Address relationships
User.hasMany(Address, { as: 'addresses' });
Address.belongsTo(User);

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
  timestamps: true
});

// Job relationships
User.hasMany(Job, { as: 'jobs' });
Job.belongsTo(User);

// connection.sync();

module.exports = {
  connection: connection,
  User: User,
  Address: Address,
  Job: Job
};
