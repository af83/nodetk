/* Run all tests present in files 'test_*.js' present in given directory or sub dirs.
 * Search recursivly for test files.
 */

var fs = require('fs');
var sys = require('sys');

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
  sys.puts("Run tests in " + tests_dir);

  to_test = get_test_files(tests_dir);
  tests_runner.run(to_test);
};


var get_test_files = function(tests_dir) {
  if(!tests_dir.match(/\/$/)) tests_dir += '/';
  var to_search_in = [];
  var to_test = fs.readdirSync(tests_dir).map(function(fname){
    return tests_dir + fname;
  }).filter(function(fpath) {
    if (fs.statSync(fpath).isDirectory()) {
      to_search_in.push(fpath);
      return false;
    }
    return fpath.match(/\/test_[^\/]+\.js$/);
  }).map(function(fpath) {
    return fpath.replace(/\.js$/, '');
  });
  to_search_in.forEach(function(dirpath) {
    to_test = to_test.concat(get_test_files(dirpath));
  });
  return to_test;
};

run_tests();

