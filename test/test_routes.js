var assert = require('assert'),
  request = require('request');

module.exports = {
  'Users': {
    'POST /users': {
      'should return a new user': function() {
        request({
            url: 'http://localhost:5000/api/v1/users',
            method: 'POST',
            json: {
              first_name: 'John',
              last_name: 'Carmack',
              phone: '+11234567890',
              email: 'john@doom.com',
              password: 'doomiscoming',
              street: '1500 N Greenville Ave #700',
              city: 'Richardson',
              state: 'TX',
              postal_code: '75081'
            }
          }, function(error, response, body) {
            assert.equal(response.statusCode, 200);
            assert.notEqual(body.id, null);
        });
      }
    }
  }
};
