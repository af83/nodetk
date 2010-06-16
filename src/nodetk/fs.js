/* Some handy functions to manipulate the FS
 */

var fs = require('fs');
var PATH = require('path');

var CLB = require('nodetk/orchestration/callbacks');
var debug = require('nodetk/logging').debug;
var utils = require('nodetk/utils');


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


var existsSync = exports.existsSync = function(path) {
  /** Returns True if the path exists, False otherwise.
   *  Synchronous function.
   */
  try {
    process.binding('fs').stat(path);
    return true;
  } catch (e) {
    return false;
  }
};


var find_modules_paths = exports.find_modules_paths = function(module_names) {
  /** Returns dic {} associating each module name with its path.
   *  If a module path has not been found, the associated value is null.
   *  Sunchronous function.
   */
  var results = {};
  module_names.forEach(function(name){
    results[name] = null;
  });
  var dirs = require.paths.slice();
  require.paths.forEach(function(path) {
    var path2 = path + "/libraries"; // to get node libraries
    if(existsSync(path2)) dirs.push(path2);
  });
  dirs.forEach(function(path) {
    module_names.forEach(function(name) {
      var module_path = path + '/' + name + '.js';
      if(results[name] == null && existsSync(module_path)) {
        results[name] = module_path;
      }
    });
  });
  return results;
};


var find_packages_paths = exports.find_packages_paths = function(package_names, callback, fallback) {
  /** Returns dic associating each module name (of every package) with its path.
   *  ASynchronous function.
   */
  var package2dir = {};
  var cpt_dirs = 0;
  package_names.forEach(function(pname) {
    for(var i=0; i<require.paths.length; i++) {
      var dir_path = PATH.normalize(require.paths[i] + '/' + pname);
      if(existsSync(dir_path)) {
        package2dir[pname] = dir_path;
        cpt_dirs += 1;
        break;
      }
    }
  });

  var results = {};

  var waiter = CLB.get_waiter(cpt_dirs, function() {
    callback(results);
  }, function(err) {
    fallback && fallback(err);
  });

  utils.each(package2dir, function(pname, dir_path) {
    getDeepFilesDirs(dir_path, function(fpaths) {
      fpaths.filter(function(e){return e.match(/.?\.js$/)})
            .forEach(function(fpath) {
        var pos1 = dir_path.length;
        var pos2 = fpath.lastIndexOf('.js');
        var module_name = pname + fpath.slice(pos1, pos2);
        results[module_name] = fpath;
      });
      waiter();
    });
  });
};

