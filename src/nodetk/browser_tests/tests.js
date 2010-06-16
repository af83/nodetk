
/**
 * See nodejs lib sys.
 */
var inherits = function (ctor, superCtor) {
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
  memoryUsage: function() {return 'Not available'},
  stdout: stdio_stdout,
  stdio: stdio_stdout,
  binding: function() {return {
    writeError: function(data) {console.error(data)}
  }},
  inherits: inherits
};

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

var run_tests = function() {
  var logging = require('nodetk/logging');
  logging.debug.on();
  
  var tests_runner = require('nodetk/testing/tests_runner');
  tests_runner.run([
   'nodetk/tests/orchestration/test_callbacks',
   'nodetk/tests/test_utils',
   'nodetk/tests/text/test_search'
  ]);
};

require.ensure([
  'sys',
  'assert',
  'nodetk/logging',
  'nodetk/testing/tests_runner',
  'nodetk/testing/custom_assert',
  'nodetk/orchestration/callbacks',
  'nodetk/tests/orchestration/test_callbacks',
  'nodetk/utils',
  'nodetk/tests/test_utils',
  'nodetk/text/search',
  'nodetk/tests/text/test_search'
  ], run_tests);

