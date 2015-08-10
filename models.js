// Global packages
var Sequelize = require('sequelize'),
  bcrypt = require('bcrypt-nodejs');

// Configuration by NODE_ENV (test, development, production)
var env = process.env.NODE_ENV || "development";
var config = require('./config')[env];
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
  },
  facebook: {
    type: Sequelize.STRING
  },
  google: {
    type: Sequelize.STRING
  },
  outlook: {
    type: Sequelize.STRING
  }
}, {
  timestamps: true,
  instanceMethods: {
    validatePassword: function(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }
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

// Company model
var Company = connection.define('company', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
    unique: true
  },
  name: {
    type: Sequelize.STRING
  }
}, {
  timestamps: true
});

// Tag model
var Tag = connection.define('tag', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
    unique: true
  },
  name: {
    type: Sequelize.STRING
  }
}, {
  timestamps: true
});

// Tag relationships
Company.belongsToMany(Tag, { through: 'CompanyTag' });
Tag.belongsToMany(Company, { through: 'CompanyTag' });

// Employee model
var Employee = connection.define('employee', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
    unique: true
  },
  role: {
    type: Sequelize.STRING
  }
}, {
  timestamps: true
});

// Employee relationships
User.hasMany(Employee);
Employee.belongsTo(User);

Company.hasMany(Employee);
Employee.belongsTo(Company);

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
  finish: {
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
Address.belongsToMany(Job, { through: 'JobAddress' });
Job.belongsToMany(Address, { through: 'JobAddress'});

Employee.belongsTo(Job);
Job.hasOne(Employee);

// Coordinate model
var Coordinate = connection.define('coordinate', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
    unique: true
  },
  latitude: {
    type: Sequelize.DOUBLE
  },
  longitude: {
    type: Sequelize.DOUBLE
  }
}, {
  timestamps: true
});

// Coordinate relationships
Coordinate.belongsToMany(Job, { through: 'JobCoordinate' });
Job.belongsToMany(Coordinate, { through: 'JobCoordinate' });

Employee.belongsToMany(Coordinate, { through: 'EmployeeCoordinate' });
Coordinate.belongsToMany(Employee, { through: 'EmployeeCoordinate' });

// Address.hasOne(Coordinate);
// Coordinate.belongsTo(Address);

module.exports = {
  connection: connection,
  User: User,
  Address: Address,
  Coordinate: Coordinate,
  Job: Job
};
