

var assert = require('nodetk/testing/custom_assert');
var CLB = require('nodetk/orchestration/callbacks');


exports.tests = [

  ['get_waiter(): 0 callbacks', 1, function() {
    var waiter = CLB.get_waiter(0, function() {
      assert.ok(true, 'callback called');
    }, function(){assert.ok(false, 'should not be called')});
  }],

  ['get_waiter(): all callbacks succeed', 1, function() {
    var waiter = CLB.get_waiter(3, function() {
      assert.ok(true, 'callback called');
    }, function(){assert.ok(false, 'should not be called')});
    waiter(); waiter(); waiter();
  }],

  ['get_waiter(): failue', 1, function() {
    var error_msg = 'some error';
    var waiter = CLB.get_waiter(3, function() {
      assert.ok(false, 'callback should not be called');
    }, function(err) {
      assert.equal(err, error_msg);
    });
    waiter(); 
    waiter.fall(error_msg); 
    waiter();
  }],


];

