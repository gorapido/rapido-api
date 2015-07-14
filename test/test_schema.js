var assert = require('assert');
var helpers = require('./../lib/test_helpers'),
  schema = require('./../app/db/schema');
var columnDoesExist = helpers.columnDoesExist,
  columnIsType = helpers.columnIsType,
  UserTable = schema.UserTable,
  JobTable = schema.JobTable;

module.exports = {
  'UserTable': {
    '#getTableName': {
      'should return a the name users': function() {
        assert.equal(UserTable.getTableName(), 'users');
      }
    },
    '#describe': {
      'should accurately name columns and their types': function() {
        UserTable.describe().then(function(columns) {
          console.log(columns);
          // first_name
          var first_name = columns.first_name;
          columnDoesExist(first_name);
          columnIsType(first_name, 'CHARACTER VARYING');

          // last_name
          var last_name = columns.last_name;
          columnDoesExist(last_name);
          columnIsType(last_name, 'CHARACTER VARYING');

          // phone
          var phone = columns.phone;
          columnDoesExist(phone);
          columnIsType(phone, 'CHARACTER VARYING');

          // email
          var email = columns.email;
          columnDoesExist(email);
          columnIsType(email, 'CHARACTER VARYING');

          // password
          var password = columns.password;
          columnDoesExist(password);
          columnIsType(password, 'CHARACTER VARYING');

          // Test address

          // street
          var street = columns.street;
          columnDoesExist(street);
          columnIsType(street, 'CHARACTER VARYING');

          // city
          var city = columns.city;
          columnDoesExist(city);
          columnIsType(city, 'CHARACTER VARYING');

          // state
          var state = columns.state;
          columnDoesExist(state);
          columnIsType(state, 'CHARACTER VARYING');

          // postal_code
          var postal_code = columns.postal_code;
          columnDoesExist(postal_code);
          columnIsType(postal_code, 'CHARACTER VARYING');
        });
      }
    }
  }
};
