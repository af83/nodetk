
var run_tests = function() {
  
  var tests_runner = require('nodetk/testing/tests_runner');
  tests_runner.run([
   'nodetk/tests/orchestration/test_callbacks',
   'nodetk/tests/test_random_str',
   'nodetk/tests/test_utils',
   'nodetk/tests/text/test_search'
  ]);
};

run_tests();

