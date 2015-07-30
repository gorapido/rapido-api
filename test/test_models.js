var assert = require('assert');
var models = require('./../app/models');
var User = models.User,
  Job = models.Job;

module.exports = {
  user: null,
  'User': {
    'before': function() {
      user = User.build();
    },
    'set first_name': {
      'it should uppercase the first name': function() {
        var firstName = 'paul';

        user.set('first_name', firstName);

        assert.notEqual(user.get('first_name'), firstName);
      }
    },
    'set last_name': {
      'it should uppercase the last name': function() {
        var lastName = 'paul';

        user.set('last_name', lastName);

        assert.notEqual(user.get('last_name'), lastName);
      }
    },
    'set password': {
      'it should hash the password after being set': function() {
        var password = 'scotchyscotchscotch';

        user.set('password', password);

        assert.notEqual(user.get('password'), password);
      }
    }
  }
};
