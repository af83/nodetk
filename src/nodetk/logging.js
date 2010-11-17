/* Provides debug function, wrapper around console.log, [de]activable on demand.
 */

var debug_active = false;
exports.debug = function(/* stuff to print*/) {
  if(debug_active) {
    var args = Array.prototype.slice.apply(arguments);
    var str = args.map(function(elem) {
      if(typeof elem == "string") return elem;
      return JSON.stringify(elem);
    }).join(" ");
    console.log(str);
  }
};

exports.debug.on = function() {debug_active=true};
exports.debug.off = function() {debug_active=false};

