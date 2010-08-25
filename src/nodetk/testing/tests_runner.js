/* Runs all the tests in a file.
 * Tests are ran one by one, synchronously.
 *
 * Tests must be in module.tests.
 * You can specify:
 *  - a setup function (using exports.setup), which will run before every test.
 *  - a module_init function, which will run once before the first test start.
 *  - a module_close function, which will run once all tests are done.
 *
 */

var sys = require("sys");

var custom_assert = require("nodetk/testing/custom_assert");
var CLB = require('nodetk/orchestration/callbacks');
var debug = require('nodetk/logging').debug;

var verbose;
var start_time;

exports.run = function(tests_files) {
  var args = {};
  process.argv.forEach(function(e){args[e]=true;});
  verbose = args['-v'];
  if (args['-d']) debug.on();
  else debug.off();

  start_time = new Date().getTime();
  CLB.sync_calls(run_test_file, tests_files, function() {
    display_process_infos();
    // TODO: maybe we should wait a bit here, if there is more callbacks than expected,
    // then there is a problem...
    process.exit(0);
  });
};


var dummy = function(callback) {callback()};
var setup;

var run_test = function(name, expected_asserts, test, callback) {
  /* Run given test fct, having given name.
   * The test function must use expected_asserts number of asserts.
   * callback is ran when the expected number of asserts has been called.
   */
  setup(function() {
    var test_waiter = CLB.get_waiter(expected_asserts, function(){
      verbose && sys.puts(name + ': ' + expected_asserts + " asserts done.");
      callback && callback();
    });
    custom_assert._set_assert_callback(test_waiter);
    test();
  });
}

var run_test_file = exports.run_test_file = function(test_file, callback) {
  debug('Run test file ' + test_file);
  try {
    var module = require(test_file);
    setup = module.setup || dummy; // To be run before every test
    module_init = module.module_init || dummy; // To be ran once before the first test
    module_close = module.module_close || dummy; // To be ran once after all tests have finished
    module_init(function() {
      CLB.sync_calls(run_test, module.tests || [], function() {
        verbose && sys.puts('-----------------');
        verbose && sys.puts(test_file + '.js: ' + module.tests.length +
                            " test(s) succeed\n");
        module_close(function() {
          callback && callback();
        });
      });
    });
  } catch (e) {
    sys.puts("Error while running test file " + test_file);
    throw e;
  }
};

var display_process_infos = function() {
  var end_time = new Date().getTime();
  var mem_use = process.memoryUsage();
  sys.puts("\n================");
  sys.puts("Ellapsed time: " + (end_time - start_time) + "ms.");
  sys.puts("Memory use: " + JSON.stringify(mem_use));
};


