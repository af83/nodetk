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
var custom_assert = require("nodetk/testing/custom_assert");
var CLB = require('nodetk/orchestration/callbacks');
var debug = require('nodetk/logging').debug;

var verbose;
var start_time;

NB_TEST_FILES_RAN = 0;

exports.run = function(tests_files) {
  var args = {};
  process.argv.forEach(function(e){args[e]=true;});
  verbose = args['-v'];
  if (args['-d']) debug.on();
  else debug.off();

  start_time = new Date().getTime();
  console.log("Number of test files to run:", tests_files.length);
  CLB.sync_calls(run_test_file, tests_files, function() {
    process.nextTick(function () {
      display_process_infos();
      process.exit(0);
    });
    custom_assert._set_assert_callback(function() {
      throw new Error('More asserts than expected were ran :(');
    });
  });
  process.once('exit', function() {
    if(NB_TEST_FILES_RAN != tests_files.length) {
      console.log('\nThe tests did not finish :(');
      process.exit(1);
    }
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
    verbose && console.log('Starting test "'+name+'" (' + 
                           expected_asserts+' asserts expected)...');
    var test_waiter = CLB.get_waiter(expected_asserts, function(){
      verbose && console.log(name + ': ' + expected_asserts + " asserts done.");
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
        verbose && console.log('-----------------');
        verbose && console.log(test_file + '.js: ' + module.tests.length +
                            " test(s) succeed");
        module_close(function() {
          NB_TEST_FILES_RAN += 1;
          callback && callback();
        });
      });
    });
  } catch (e) {
    console.log("Error while running test file " + test_file);
    throw e;
  }
};

var display_process_infos = function() {
  var end_time = new Date().getTime();
  var mem_use = process.memoryUsage();
  console.log("\n================");
  console.log("Ellapsed time: " + (end_time - start_time) + "ms.");
  console.log("Memory use: " + JSON.stringify(mem_use));
};


