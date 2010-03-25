/* Wraps assert functions to call a callback, and display a dot (.) when success */

var assert = require('assert');
var sys = require('sys');

// ----------------------------------------
// New assert functions:

assert.same_sets = function(actual, expected) {
  /* Check the array actual is included in the array expected, and vice & versa.
   */
  var message = "Not equivalent sets: " + 
                JSON.stringify(actual) + ' != ' + JSON.stringify(expected);
  var to_have = expected.slice();
  actual.forEach(function(element) {
    var index = to_have.indexOf(element);
    if(index < 0) assert.fail(actual, expected, message, "==", assert.equal);
    to_have.splice(index, 1);
  });
  if(to_have.length > 0) assert.fail(actual, expected, message, "==", assert.equal);
};

// ----------------------------------------


// will be called after each assert
var callback = function(){};


for(var attr in assert) 
  if(typeof assert[attr] == 'function' && attr != 'AssertionError') {
  (function(func) {
    exports[func] = function() {
      assert[func].apply(this, arguments);
      sys.print('.');
      callback();
    };
  })(attr);
}

exports._set_assert_callback = function(clbck){
  /* Set a callback to call after each assert.
   */
  callback = clbck;
};

