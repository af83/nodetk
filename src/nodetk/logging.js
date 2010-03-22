/* Provides debug function, wrapper around sys.puts, [de]activable on demand.
 */

var sys = require("sys");

var debug_active = false;
exports.debug = function(/* stuff to print*/) {
  if(debug_active) sys.puts.apply(this, arguments);
};

exports.debug.on = function() {debug_active=true};
exports.debug.off = function() {debug_active=false};

