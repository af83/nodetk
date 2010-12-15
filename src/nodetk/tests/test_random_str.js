
var assert = require('nodetk/testing/custom_assert');
var randomString = require('nodetk/random_str').randomString;


exports.tests = [

['test length', 2, function() {
  var res = randomString(1);
  assert.equal(res.length, 1);
  res = randomString(24);
  assert.equal(res.length, 4);
}],

];

