/* Run all tests present in files 'test_*.js' present in given directory or sub dirs.
 * Search recursivly for test files.
 */
var util = require('util');

require.paths.unshift(__dirname + '/../..') // to have nodetk in require.paths
var fs = require('nodetk/fs');

var tests_runner = require('nodetk/testing/tests_runner');

var run_tests = function() {
  var args = {};
  var tests_dir = '.';

  process.argv.shift(); // remove 'node'
  process.argv.shift(); // remove 'nodetests.js'

  process.argv.forEach(function(e){
    if(e[0] == '-') args[e]=true;
    else tests_dir = e;
  });
  
  if(tests_dir[0] != '/') tests_dir = process.cwd() + '/' + tests_dir;
  util.print("Run tests in " + tests_dir + '\n');

  if(tests_dir.match(/\.js$/)) tests_runner.run([tests_dir]);
  else get_test_files(tests_dir, function(to_test) {
    tests_runner.run(to_test);
  });

};


var get_test_files = function(tests_dir, callback) {
  fs.getDeepFilesDirs(tests_dir, function(files) {
    var to_test = files.filter(function(fpath) {
      return fpath.match(/\/test_[^\/]+\.js$/);
    }).map(function(fpath) {
      return fpath.replace(/\.js$/, '');
    });
    callback(to_test);
  });
};

run_tests();

