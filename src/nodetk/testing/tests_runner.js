/* Runs all the tests in a file.
 * Tests are ran one by one, synchronously.
 *
 * Tests must be in module.tests.
 * You can specify a setup function (using exports.setup), 
 * which will run before every test.
 */

var sys = require("sys");

var custom_assert = require("nodetk/testing/custom_assert");
var CLB = require('nodetk/orchestration/callbacks');

var verbose;
var start_time;

exports.run = function(tests_files) {
  var args = {};
  process.argv.forEach(function(e){args[e]=true;});
  verbose = args['-v'];

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

var run_test_file = function(test_file, callback) {
  var module = require(test_file);
  setup = module.setup || dummy;
  CLB.sync_calls(run_test, module.tests || [], function() {
    verbose && sys.puts('-----------------');
    verbose && sys.puts(test_file + '.js: ' + module.tests.length + " test(s) succeed\n");
    callback();
  });
};

var display_process_infos = function() {
  var end_time = new Date().getTime();
  var mem_use = process.memoryUsage();
  sys.puts("\n================");
  sys.puts("Ellapsed time: " + (end_time - start_time) + "ms.");
  sys.puts("Memory use: " + JSON.stringify(mem_use));
};


