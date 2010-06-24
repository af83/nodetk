
var sys = require('sys');
var assert = require('nodetk/testing/custom_assert');
var fstk = require('nodetk/fs');


var data_dir = __dirname + '/data/fs/';
var prefix_datadir = function(path){return data_dir + path};


exports.tests = [

['getFileDirs()', 2, function() {
  var expected_files = ['f1', 'f2'].map(prefix_datadir);
  var expected_dirs = ['dir1', 'dir2'].map(prefix_datadir);
  fstk.getFilesDirs(data_dir, function(files, dirs) {
    assert.same_sets(files, expected_files);
    assert.same_sets(dirs, expected_dirs);
  });
}],

['getDeepFilesDirs()', 2, function() {
  var expected_files = [
    'f1', 'f2', 'dir1/dir11/f1111', 'dir1/dir12/dir121/f1121211', 'dir2/dir21/f1211'
  ].map(prefix_datadir);
  var expected_dirs = [
    'dir1', 'dir2', 'dir1/dir11', 'dir1/dir12', 'dir1/dir12/dir121', 'dir2/dir21'
  ].map(prefix_datadir);
  fstk.getDeepFilesDirs(data_dir, function(files, dirs) {
    assert.same_sets(files, expected_files);
    assert.same_sets(dirs, expected_dirs);
  }, function() {
    assert.ok(false, "Should not be called");
  });
}],


['find_modules_paths()', 2, function() {
  var res = fstk.find_modules_paths(['assert', 'sys']);
  assert.ok(res);
  assert.throws(function() {
    fstk.find_modules_paths(['tototititiotot']);
  });
}],


];

