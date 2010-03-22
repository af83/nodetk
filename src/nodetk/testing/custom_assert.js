/* Wraps assert functions to call a callback, and display a dot (.) when success */

var assert = require('assert');
var sys = require('sys');

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

