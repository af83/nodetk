

var run_tests = function() {
  
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

