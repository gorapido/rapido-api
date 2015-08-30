// Global packages
var Sequelize = require('sequelize'),
  bcrypt = require('bcrypt-nodejs'),
  mandrill = require('mandrill-api/mandrill'),
  crypto = require('crypto'),
  twilio = require('twilio')('AC30305b01bf87626c22b822a0584ab5d9', '173b5a54238da3ced4a7face0b1d7098');

// Configuration by NODE_ENV (test, development, production)
var env = process.env.NODE_ENV || "development";
var config = require('./config')[env];
var database = config.database;
var mailer = new mandrill.Mandrill('QNNwxuvT5GB5R0MkjzZ7Yg');

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
    },
    set: function(val) {
      var hash = crypto.randomBytes(20).toString('hex');

      twilio.sendMessage({
        to: val,
        from: '+14073782199',
        body: 'Please confirm your phone number for Rapido by clicking this link: http://account.gorapido.co/confirm_phone?token=' + hash
      }, function(err, res) {
        if (!err) {

        }
        else {
          console.log(err);
        }
      });

      this.setDataValue('phone_confirmation_token', hash);
    }
  },
  twilio_phone: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    },
    set: function(val) {
      var hash = crypto.randomBytes(20).toString('hex');
      var message = {
        "from_email": "support@gorapido.co",
        "from_name": "Support",
        "subject": "Please confirm your email for Rapido.",
        "html": '<p>Please click this link to confirm your email:</p><p>http://account.gorapido.co/confirm_email?token=' + hash + '</p>',
        "to": [{
          "email": val
        }]
      };

      mailer.messages.send({ message: message }, function(res) {
        console.log(res);
      }, function(err) {  
        console.log(err);
      });

      this.setDataValue('email_confirmation_token', hash);
      this.setDataValue('email', val);
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
  phone_confirmation_token: {
    type: Sequelize.STRING
  },
  email_confirmation_token: {
    type: Sequelize.STRING
  },
  password_reset_token: {
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

Job.belongsTo(Employee);
Employee.hasMany(Job);

Job.belongsTo(User);
User.hasMany(Job);

Job.belongsTo(Company);
Company.hasMany(Job);

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
  Employee: Employee,
  Company: Company,
  Address: Address,
  Coordinate: Coordinate,
  Job: Job
};
