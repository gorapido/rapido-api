var assert = require('assert');

module.exports = {
  columnDoesExist: function(column) {
    assert.notEqual(column, null);
  },
  columnIsType: function(column, type) {
    assert.equal(column.type, type);
  }
};
