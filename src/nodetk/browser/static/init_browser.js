/** This code is to be ran on client side
 * so that the browser can execute JS for node correctly.
 */


var inherits = function (ctor, superCtor) {
  /** See nodejs lib sys (or util).
   */
  var tempCtor = function(){};
  tempCtor.prototype = superCtor.prototype;
  ctor.super_ = superCtor;
  ctor.prototype = new tempCtor();
  ctor.prototype.constructor = ctor;
};

var stdio_stdout = {
  write: function(data) {
    data = data.replace(/\n/g, '<br />');
    document.body.innerHTML += data;
  }
};


process = {
  exit: function(){},
  argv: ['-v', '-d'],
  browser: true,
  memoryUsage: function() {return 'Not available'},
  stdout: stdio_stdout,
  stdio: stdio_stdout,
  binding: function() {return {
    writeError: function(data) {console.error(data)}
  }},
  inherits: inherits
};

__dirname = 'browser';

if(!Object.keys) {
  // The function is only defined in V8.
  Object.keys = function(obj) {
    var keys = new Array();
    for(var key in obj) {
      keys.push(key);
    }
    return keys;
  }
}

