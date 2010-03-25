/* Some handy functions to manipulate the FS
 */

var sys = require('sys');
var fs = require('fs');
var PATH = require('path');

var CLB = require('nodetk/orchestration/callbacks');
var debug = require('nodetk/logging').debug;


var getFilesDirs = function(path, callback, fallback) {
  /* Given a directory path, list files and dirs in it, then
   * calls callback(fpaths, dirpaths) or fallback(err).
   */
  fs.readdir(path, function(err, files) {
    if (err != null) return fallback && fallback(err);
    var file_paths = [];
    var dir_paths = [];
    var waiter = CLB.get_waiter(files.length, function() {
      callback(file_paths, dir_paths);
    }, function(err) {
      debug("Error:", err);
      fallback && fallback(err);
    });
    files.forEach(function(file) {
      var fpath = PATH.normalize(path + '/' + file);
      fs.stat(fpath, function(err, stats){
        if(err) return waiter.fall(err);
        if (stats.isFile()) file_paths.push(fpath);
        else dir_paths.push(fpath);
        waiter();
      });
    });
  });
};
exports.getFilesDirs = getFilesDirs;


var getDeepFilesDirs = function(path, callback, fallback) {
  /* Given a directory path, list files and dirs in it (and recursively in all sub dirs),
   * then calls callback(fpaths, dirpaths) or fallback(err).
   */
  var file_paths = [];
  var dir_paths = [];
  var treat_dir = function(dirpath, callback, fallback) {
    getFilesDirs(dirpath, function(fpaths, dirpaths) {
      dir_paths = dir_paths.concat(dirpaths);
      file_paths = file_paths.concat(fpaths);
      var waiter = CLB.get_waiter(dirpaths.length, callback, fallback);
      dirpaths.forEach(function(dpath) {
        treat_dir(dpath, waiter, waiter.fall);
      });
    }, fallback);
  };
  treat_dir(path, function() {
    callback(file_paths, dir_paths);
  }, fallback);
};
exports.getDeepFilesDirs = getDeepFilesDirs;

